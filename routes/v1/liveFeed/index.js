var express = require('express');
var router = express.Router();

var { notifyNearbyUsers , notifyTaggedUsers } = require('../../../helpers/campaignPostNotifications') ; 
var verifyUser = require('../../../middleware/auth/verifyUser');
var refreshJWT = require('../../../middleware/auth/refreshJWT');

var getCampaignPostIncludes = require ('../../../helpers/campaignPostIncludes') ; 
var {db} = require('../../../db/models');
var elementsPerPage = 5;


router.use('/search', require('./search'));

async function addCampaignNeed(campaignId, needType, needs) {
    if (needs === undefined)
        return;
    for (let i = 0; i < needs.length; i++)
        needs[i].campaignId = campaignId;
    await db[needType].bulkCreate(needs);
}

async function addHashTags(campaingId,userId,hashTags){
    if(!hashTags)
        return ; 
    for(let i = 0 ; i < hashTags.length ; i ++ ){
        db.tags.create({
            name:hashTags[i],
            campaignId:campaingId,
            userId
        });
    }
}

// --------------- Main ----------------------
    router.get('/organizationsLatestPost/:userId', verifyUser, async function (req, res, next) {
        try {
            let campaignPosts = await db.campaignPosts.findAll({
                where: {'$campaign.userId$':req.params.userId},
                include: getCampaignPostIncludes(req.user.id),
                order: [['updatedAt','DESC']]
            });
            req.response_data = {
                payload: campaignPosts[0],
                status: 200
            };
            next();
        } catch (err) {
            next(err);
        }
    }, refreshJWT);

    router.get('/all', verifyUser, async function (req, res, next) {
        try {
            let campaignPosts = await db.campaignPosts.findAll({
                include: getCampaignPostIncludes(req.user.id),
                limit: elementsPerPage,
                offset: elementsPerPage * (req.query.page ? req.query.page : 0),
                order: [['updatedAt','DESC']]
            });
            req.response_data = {
                payload: campaignPosts,
                status: 200
            };
            next();
        } catch (err) {
            next(err);
        }
    }, refreshJWT);

    router.get('/connected', verifyUser, async function (req, res, next) {
        try {
            let campaignPosts = await db.campaignPosts.findAll({
                where: {'$campaign.user.connections.id$':req.user.id},
                include: getCampaignPostIncludes(req.user.id, {withConnections:true}),
                limit: elementsPerPage,
                offset: elementsPerPage * (req.query.page ? req.query.page : 0),
                order: [['updatedAt','DESC']]
            });
            req.response_data = {
                payload: campaignPosts,
                status: 200
            };
            next();
        } catch (err) {
            next(err);
        }
    } , refreshJWT);

    router.post('/createCampaign', verifyUser, async function (req, res, next) {
        try {
            if (!req.user.isOrganization) {
                res.send(401);
                return;
            }
            let campaign = await db.campaigns.create({
                ...req.body.campaign,
                userId: req.user.id
            });
            let post ; 
            let user = await db.users.findOne({where:{id:req.user.id}}) ; 
            console.log(req.user.id);
            addHashTags(campaign.id,req.user.id,req.body.campaign.hashTags) ;  
            await Promise.all([
                addCampaignNeed(campaign.id, 'moneyNeeds', req.body.campaign.moneyNeeds),
                addCampaignNeed(campaign.id, 'inPersonNeeds', req.body.campaign.inPersonNeeds),
                addCampaignNeed(campaign.id, 'skillNeeds', req.body.campaign.skillNeeds),
                post = db.campaignPosts.create({
                    ...req.body.campaignPost,
                    campaignId: campaign.id
                })
            ]);
            if(campaign.urgencyLevel === 'urgent')
                notifyNearbyUsers (user , (await post) , 3 ) ;
            notifyTaggedUsers (user , (await post) ) ;
            req.response_data = {
                status: 201
            };
            next();
        } catch (err) {
            console.log(err);
            next(err);
        }
    }, refreshJWT);

    router.get('/campaignPosts/:campaignId', verifyUser, async function (req, res, next) {
        try{
            let payload = await db.campaignPosts.findAll({
                where:{campaignId:req.params.campaignId},
                include: getCampaignPostIncludes(req.user.id)
            }) ;
            req.response_data = {
                payload,
                status: 200
            };
            next() ; 
        }
        catch(err){
            next(err) ; 
        }
    }, refreshJWT);

    router.get('/originalPost/:campaignId', verifyUser, async function (req, res, next) {
        try{
            let payload = await db.campaignPosts.findOne({
                where:{campaignId:req.params.campaignId},
                include: getCampaignPostIncludes(req.user.id)
            });
            req.response_data = {
                payload,
                status: 200
            };
            next() ; 
        }catch(err){
            next(err) ; 
        }
    } , refreshJWT);

// --------------- campaignSupporters ----------------------

    router.get('/campaignSupporters/connected', verifyUser, async function (req, res, next) {
        try{
            let payload = await db.campaignSupport.findAll({
                where: {'$user.connections.id$':req.user.id},
                include:[{
                    model:db.moneyNeeds
                },{
                    model:db.skillNeeds
                },{
                    model:db.inPersonNeeds
                },{
                    model: db.users,
                    attributes:['id','username','name','mediaPath','isOrganization'],
                    include:[{
                        model: db.users,
                        attributes:['id'],
                        through:{ where:{ connectedUserId:req.user.id } },
                        as:'connections',
                        required:false,
                        duplicating:false
                    }]
                }] , 
                limit: elementsPerPage,
                offset: elementsPerPage * (req.query.page ? req.query.page : 0),
                order: [['updatedAt','DESC']]
            }) ;
            req.response_data = {
                payload,
                status: 200
            };
            next() ; 
        }
        catch(err){
            next(err) ; 
        }
    }, refreshJWT);

    router.get('/campaignSupporters/all', verifyUser, async function (req, res, next) {
        try{
            let payload = await db.campaignSupport.findAll({
                include:[{
                    model:db.moneyNeeds
                },{
                    model:db.skillNeeds
                },{
                    model:db.inPersonNeeds
                },{
                    model: db.users,
                    attributes:['id','username','name','mediaPath','isOrganization'],
                }] , 
                limit: elementsPerPage,
                offset: elementsPerPage * (req.query.page ? req.query.page : 0),
                order: [['updatedAt','DESC']]
            }) ;
            req.response_data = {
                payload,
                status: 200
            };
            next() ; 
        }
        catch(err){
            next(err) ; 
        }
    }, refreshJWT);

module.exports = router;