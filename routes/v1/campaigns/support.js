var express = require('express');
var router = express.Router();
var {db} = require('../../../db/models');
var stripe = require("stripe")(process.env.stripe_secret_key);  
var sendPushNotification = require('../../../helpers/sendPushNotification') ;
var createChatRoom = require('../../../helpers/createChatRoom') ;

var i18n = require('../../../config/locales') ; 
var removeMd = require('remove-markdown');

var verifyUser = require('../../../middleware/auth/verifyUser');
var refreshJWT = require('../../../middleware/auth/refreshJWT');

const Chatkit = require('@pusher/chatkit-server');
const chatkit = new Chatkit.default({
    instanceLocator: process.env.chatkit_instance_prefix + ':' + process.env.chatkit_instance,
    key: process.env.chatkit_secret_key_id + ':' + process.env.chatkit_secret_key
});


let moneyThreshold = 0.5 ; 

router.post('/money/:campaignId', verifyUser, async function (req, res, next) {
    let transaction;
    let payment ; 
    let stripeUserId ;
    try {
        transaction = await db.sequelize.transaction({
            isolationLevel: db.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE            
        });

        req.body.moneySupport.sort( (a,b)=>{return parseInt(a.moneyNeedId)-parseInt(b.moneyNeedId) ; })  ; 
        let moneyNeeds = await db.moneyNeeds.findAll({
            where:{
                id: {[db.Sequelize.Op.in]: req.body.moneySupport.map(x => {return x.moneyNeedId;}) },
                campaignId:req.params.campaignId
            },
            include:[{model:db.campaignSupport}]
        } , {transaction}) ; 

        if(moneyNeeds.length !== req.body.moneySupport.length)
            throw new Error(`Invalid moneyNeeds for campaign`);
        moneyNeeds.sort( (a,b)=>{return a.id-b.id; })  ; 
        for(let i = 0 ; i < req.body.moneySupport.length ; i ++ ){
            let supportTotal = 0 ; 
            if(moneyNeeds[i].campaignSupports)
                moneyNeeds[i].campaignSupports.forEach(support => { supportTotal += support.moneyAmmount; }) ; 
            if(supportTotal+parseFloat(req.body.moneySupport[i].ammount) > moneyNeeds[i].ammount+moneyThreshold )
                throw new Error(`money ammount exceeded for moneyNeed: ${moneyNeeds[i].description}`);
        }

        let notificationAmmount  ; 
        let totalAmmount = 0 ; 
        req.body.moneySupport.forEach(support=>{totalAmmount += parseFloat(support.ammount);}) ; 
        if(req.body.optionalDonationForOrganization)
            totalAmmount += parseFloat(req.body.optionalDonationForOrganization.ammount) ; 
        notificationAmmount = totalAmmount ; 
        if(req.body.optionalDonation)
            totalAmmount += parseFloat(req.body.optionalDonation.ammount) ;

        // consider stripe fee
        totalAmmount = (totalAmmount+0.3)/ 0.971 ; 
        if(Math.abs(totalAmmount-parseFloat(req.body.totalAmmount)) > moneyThreshold )
            throw new Error(`invalid total ammount for payment`);
        let campaign = await db.campaigns.findOne({
            where:{
                id:req.params.campaignId
            },
            include:[{
                model:db.users
            }]
        } , {transaction}) ;
        let organization = campaign.user ; 
        stripeUserId = organization.stripeUserId ; 

        let supporterUser = await db.users.findOne({where:{id:req.user.id}}) ; 
        let { userNotifications } = i18n[organization.language] ; 
        // --------------- used in eval ----------------------
        let supporterUsername = supporterUser.username ; 
        let supporterId = supporterUser.id ;
        let ammount = `$${notificationAmmount}` ;
        let campaignId = campaign.id ; 
        let campaignName = campaign.name ; 
        // ------------------------------------------

        payment = await stripe.charges.create({
            amount: Math.round(totalAmmount*100),
            currency: "usd",
            source: req.body.stripeToken,
            description: `${supporterUser.username} support for the ${campaignName} campaign`,
            capture:false,
            application_fee: req.body.optionalDonation? Math.round(parseFloat(req.body.optionalDonation.ammount)*100): 0
        },{
            stripe_account: stripeUserId,
        }) ;

        // used in eval
        let paymentId = payment.id ; 
        let gaveHelpMessage =  eval('`'+userNotifications.moneySupport+'`')   ; 
        let campaignSupport = [] ; 
        for(let i = 0 ; i < req.body.moneySupport.length ; i ++ ){
            campaignSupport.push({
                campaignId:req.params.campaignId,
                moneyNeedId:moneyNeeds[i].id,
                moneyAmmount:parseFloat(req.body.moneySupport[i].ammount),
                supportType:'money',
                userId:req.user.id,
                paymentId
            }) ; 
        }
        if(req.body.optionalDonationForOrganization)
            campaignSupport.push({
                campaignId:req.params.campaignId,
                moneyAmmount:parseFloat(req.body.optionalDonationForOrganization.ammount),
                supportType:'money',
                userId:req.user.id,
                paymentId
            }) ; 
        await db.campaignSupport.bulkCreate(campaignSupport , {transaction}) ; 

        await db.keys.findOrCreate({
            where:{
                userId:req.user.id,
                campaignId:req.params.campaignId
            },
            defaults:{
                userId:req.user.id,
                campaignId:req.params.campaignId
            }, 
            transaction
        }) ; 
        if(!stripeUserId)
            throw new Error(`Organization stripe account missing`);

        
        db.userNotifications.create({
            type:'support',
            userId:organization.id, 
            mediaPath:supporterUser.mediaPath,
            content:gaveHelpMessage
        } , {transaction} ) ;
        
        let capture = await stripe.charges.capture(payment.id, {stripe_account: stripeUserId} ) ;

        if(capture.status !== 'succeeded')
            throw new Error(`Payment unsuccessful`);
        await transaction.commit(); 
        sendPushNotification(
            organization.id, 
            '/user/notifications' , 
            'Key Conservation',
            removeMd(gaveHelpMessage)
        ) ; 
        req.response_data = {
            status: 200
        };
        next();
    } catch (err) {
        if(transaction) 
            await transaction.rollback();
        if(payment){
            try{
                await stripe.refunds.create({
                    charge: payment.id,
                    refund_application_fee:true
                } , {
                    stripe_account: stripeUserId,
                }) ;
            } catch(err){
                next(err) ; 
                return ;
            }
        }
        next(err);
    }
}, refreshJWT);

router.post('/inPerson/:inPersonNeedId', verifyUser, async function (req, res, next) {
    let room ; 
    let transaction ; 
	try {
        transaction = await db.sequelize.transaction({
            isolationLevel: db.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE            
        });
		let inPersonNeed = await db.inPersonNeeds.findOne({
			where: {
				id: req.params.inPersonNeedId
			},
			include: [{
				model: db.campaigns,
				include: [{
					model: db.users
				}]
			}]
        });
		if (!inPersonNeed) {
			req.response_data = {status: 400};
            next();
            return ;
        }
        
        let support = await db.campaignSupport.findOne({
            where:{
                inPersonNeedId: req.params.inPersonNeedId,
                supportType: 'inPerson',
                userId: req.user.id,
                campaignId: inPersonNeed.campaign.id
            }   
        }) ; 
        if(support){
            req.response_data = {status: 400};
            await transaction.rollback();
            next();
            return ;
        }

		let organizationUserId = inPersonNeed.campaign.userId;
		let supporterUser = await db.users.findOne({where: {id: req.user.id}});
		room = await createChatRoom(supporterUser.id, organizationUserId, 'campaign', {
			campaignId: inPersonNeed.campaign.id,
			skillNeedId: null,
			inPersonNeedId: parseInt(req.params.inPersonNeedId)
		});
		let { userNotifications } = i18n[inPersonNeed.campaign.user.language];
        let { userChatMessages } = i18n[inPersonNeed.campaign.user.language];
        // --------------- used in eval ----------------------
		let supporterUsername = supporterUser.username;
		let supporterId = supporterUser.id;
        let campaignName = inPersonNeed.campaign.name;
        let campaignId = inPersonNeed.campaign.id;
        // --------------------------------------------------
		let gaveHelpMessage = eval('`' + userNotifications.inPersonSupport + '`');
		let startSupportMessage = eval('`' + userChatMessages.inPersonSupport + '`');
		await Promise.all([
			chatkit.sendMessage({
				userId: `User${req.user.id}`,
				roomId: room.id,
				text: startSupportMessage,
			}),
			chatkit.updateRoom({
				id: room.id,
				customData: {
					...room.custom_data,
					timestamp: new Date().getTime()
				}
			}),
			db.campaignSupport.create({
				inPersonNeedId: req.params.inPersonNeedId,
				supportType: 'inPerson',
				userId: req.user.id,
				campaignId: inPersonNeed.campaign.id
			}, { transaction }),
			db.keys.findOrCreate({
				where: {
					userId: req.user.id,
					campaignId: inPersonNeed.campaign.id
				},
				defaults: {
					userId: req.user.id,
					campaignId: inPersonNeed.campaign.id
                } , 
                transaction
			}  ),
			db.userNotifications.create({
				type: 'support',
				userId: organizationUserId,
				mediaPath: supporterUser.mediaPath,
				content: gaveHelpMessage
			} , { transaction } ),
        ]);
        await transaction.commit(); 
        sendPushNotification(
            organizationUserId,
            '/user/notifications',
            'Key Conservation',
            removeMd(gaveHelpMessage)
        )  ;
		req.response_data = {
			status: 200
		};
		next();
	} catch (err) {
        if(transaction) 
            await transaction.rollback();
        if(room)
            await chatkit.deleteRoom({ id: room.id }) ; 
		next(err);
	}
} , refreshJWT);

router.post('/skill/:skillNeedId', verifyUser, async function(req, res, next) {
    let room ; 
    let transaction ; 
    try{
        transaction = await db.sequelize.transaction({
            isolationLevel: db.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE            
        });
        let skillNeed = await db.skillNeeds.findOne({
            where:{id:req.params.skillNeedId},
            include:[{
				model: db.campaigns,
				include:[{
					model:db.users
				}]
			}]
		}) ; 
		if(!skillNeed){
			req.response_data = { status: 400 };
            next() ; 
            return ;
        }
        
        let support = await db.campaignSupport.findOne({
            where:{
                skillNeedId: req.params.skillNeedId,
                supportType: 'skill',
                userId: req.user.id,
                campaignId: skillNeed.campaign.id
            }
        }) ; 
        if(support){
            req.response_data = {status: 400};
            await transaction.rollback();
            next();
            return; 
        }

        let organizationUserId = skillNeed.campaign.userId ; 
        let supporterUser = await db.users.findOne({where:{id:req.user.id}}) ; 
        room = await createChatRoom ( supporterUser.id , organizationUserId , 'campaign' , {
            campaignId: skillNeed.campaign.id,
            inPersonNeedId: null,
            skillNeedId: parseInt(req.params.skillNeedId)
		}) ; 
		let { userNotifications } = i18n[skillNeed.campaign.user.language] ; 
        let { userChatMessages } = i18n[skillNeed.campaign.user.language] ; 
        // --------------- used in eval ----------------------
		let skillName = skillNeed.name ;
		let supporterUsername = supporterUser.username ; 
        let supporterId = supporterUser.id ;
        let campaignId = skillNeed.campaign.id ; 
        let campaignName = skillNeed.campaign.name ;
        // -----------------------------------------
		let gaveHelpMessage =  eval('`'+userNotifications.skillSupport+'`')   ; 
        let startSupportMessage =  eval('`'+userChatMessages.skillSupport+'`')   ; 
        await chatkit.sendMessage({
            userId: `User${req.user.id}`,
            roomId: room.id,
            text: startSupportMessage,
        })  ;
        if(req.body.phoneNumber) { 
            // supporterPhoneNumber used in eval
            let supporterPhoneNumber = req.body.phoneNumber ;
            let phoneNumberMessage =  eval('`'+userChatMessages.phoneNumberMessage+'`')   ; 
            await chatkit.sendMessage({
                userId: `User${req.user.id}`,
                roomId: room.id,
                text: phoneNumberMessage,
            })  ; 
        }
        if(req.body.explanation){
            await chatkit.sendMessage({
                userId: `User${req.user.id}`,
                roomId: room.id,
                text: req.body.explanation
            })  ; 
        }
            
		await Promise.all([
            chatkit.updateRoom({
                id: room.id,
                customData: {
                    ... room.custom_data,
                    timestamp: new Date().getTime()
                }
            }) ,
			db.campaignSupport.create({   
				skillNeedId:req.params.skillNeedId,
				supportType:'skill',
				userId:req.user.id,
				campaignId:skillNeed.campaign.id
			} , { transaction }) , 
			db.keys.findOrCreate({
				where:{
					userId:req.user.id,
					campaignId:skillNeed.campaign.id
				},
				defaults:{
					userId:req.user.id,
					campaignId:skillNeed.campaign.id
                } ,  
                transaction  
			}),
			db.userNotifications.create({
				type:'support',
				userId:organizationUserId, 
				mediaPath:supporterUser.mediaPath,
				content:gaveHelpMessage
			} , { transaction })
        ]) ;
        await transaction.commit() ; 
        sendPushNotification(
            organizationUserId, 
            '/user/notifications' , 
            'Key Conservation',
            removeMd(gaveHelpMessage)
        ) ;
        req.response_data = {
            status: 200
        };
        next() ; 
    } catch(err){
        if(transaction) 
            await transaction.rollback();
        if(room)
            await chatkit.deleteRoom({ id: room.id }) ; 
        next(err) ; 
    }
} , refreshJWT);


module.exports = router;
