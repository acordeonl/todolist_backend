var express = require('express');
var router = express.Router();
var { map } = require('lodash');

var getCampaignPostIncludes = require ('../../../helpers/campaignPostIncludes') ; 
var verifyUser = require('../../../middleware/auth/verifyUser');
var refreshJWT = require('../../../middleware/auth/refreshJWT');
var {db}  = require('../../../db/models');

let elementsPerPage = 5 ;


router.get('/:userId/profile/details', verifyUser, async function (req, res, next) {
    try{
        let connected = ( await db.userConnections.find({
            where:{
                connectedUserId:req.user.id,
                connectorUserId:req.params.userId
            }
        }) ) ? true : false ; 
        let connections = await db.userConnections.count({
            where: {
                [db.Sequelize.Op.or]: [{
                    connectorUserId: req.params.userId
                }, {
                    connectedUserId: req.params.userId
                }]
            }
        });
        if (!req.user.isOrganization) {
            let keys = await db.keys.count({
                where:{
                    userId:req.user.id
                }
            }) ;
            req.response_data = {
                payload:{
                    keys,
                    connected,
                    connections
                },
                status: 200
            };
        }
        else{
            let events = null ; 
            req.response_data = {
                payload:{
                    events,
                    connected,
                    connections
                },
                status: 200
            };
        }
        
        next() ; 
    }
    catch(err){
        next(err) ; 
    }
}, refreshJWT);

// --------------- Connections ----------------------

    router.get('/profile/connectionRequests', verifyUser, async function (req, res, next) {
        try{
            let payload = await db.connectionRequests.findAll({
                where:{
                    userId:req.user.id
                }
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

    router.post('/profile/connectTo/:userId', verifyUser, async function (req, res, next) {
        try{
            let user = await db.users.find({where:{id:req.params.userId}})  ; 
            if(parseInt(req.params.userId) === req.user.id){
                req.response_data = {status: 400};
                next() ; 
                return  ; 
            }
            if(req.query.isOrganization === 'true' && !user.isOrganization){
                req.response_data = {status: 401};
                next() ; 
                return  ; 
            }
            if(req.query.isOrganization === 'true'){
                await db.userConnections.findOrCreate({
                    where:{
                        connectedUserId:req.user.id,
                        connectorUserId:req.params.userId
                    },
                    defaults:{
                        connectedUserId:req.user.id,
                        connectorUserId:req.params.userId
                    }
                }) ; 
            }
            else{
                await db.connectionRequests.findOrCreate({
                    where:{
                        userId:req.params.userId,
                        otherUserId:req.user.id
                    },
                    defaults:{
                        userId:req.params.userId,
                        otherUserId:req.user.id
                    }
                }) ;    
            }
            req.response_data = {status: 200};
            next() ; 
        }
        catch(err){
            next(err) ; 
        }
    }, refreshJWT);

    router.post('/profile/acceptConnectionTo/:userId', verifyUser, async function (req, res, next) {
        try{
            let request = await db.connectionRequests.find({
                where:{
                    userId:req.user.id,
                    otherUserId:req.params.userId 
                }
            }) ; 
            if(!request)  {
                req.response_data = {
                    status: 400
                };
                next() ; 
                return ; 
            }
            await db.userConnections.findOrCreate({
                where:{
                    connectedUserId:req.params.userId,
                    connectorUserId:req.user.id
                },
                defaults:{
                    connectedUserId:req.params.userId,
                    connectorUserId:req.user.id
                }
            }) ; 
            await db.connectionRequests.destroy({
                where:{
                    userId:req.user.id,
                    otherUserId:req.params.userId 
                }
            }) ; 
            req.response_data = {
                status: 201
            };
            next() ; 
        }
        catch(err){
            next(err) ; 
        }
    }, refreshJWT);

    router.post('/profile/disconnectFrom/:userId', verifyUser, async function (req, res, next) {
        try{
            await db.userConnections.destroy({
                where:{
                    connectedUserId:req.user.id,
                    connectorUserId:req.params.userId
                }
            });
            req.response_data = {
                status: 201
            };
            next() ; 
        }
        catch(err){
            next(err) ; 
        }
    }, refreshJWT);

    router.get('/profile/connections/:userType', verifyUser, async function (req, res, next) {
        try{
            let payload = await db.userConnections.findAll({
                where:{
                    connectedUserId:req.user.id,
                    '$user.isOrganization$':req.params.userType === 'organizations'? true : false
                },
                attributes:['id'],
                include:[{
                    model:db.users,
                    attributes:['id','username','name','mediaPath',"isOrganization"]
                }]
            });
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

// --------------- Global Supporter ----------------------

    // used for displaying keys on user profile
    router.get('/keys/:userId', verifyUser, async function (req, res, next) {
        try{
            let payload = (await db.sequelize.query(`
                select t2.name , count(*) from "keys" as t1
                inner join "tags" as t2 on t1."campaignId" = t2."campaignId"
                where t1."userId"=${req.params.userId}
                group by t2."name"
            `))[0] ; 
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

    // --------------- Skills ----------------------
        router.get('/profile/skills', verifyUser, async function (req, res, next) {
            try{
                let payload = await db.skilledImpact.findAll({
                    where:{
                        userId:req.user.id
                    } 
                });
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
        
        router.post('/profile/addSkills', verifyUser, async function (req, res, next) {
            try{
                let qResponse = await db.skilledImpact.findAll({where:{userId:req.user.id} }) ;
                let currentSkills =  qResponse.map(x => x.skill)   ;
                let newSkills = req.body.skills.filter(x => !currentSkills.includes(x)) ;
                let oldSkills = currentSkills.filter(x => !req.body.skills.includes(x)) ;
                await db.skilledImpact.destroy({ where: { skill: oldSkills }}); 
                await db.skilledImpact.bulkCreate( newSkills.map(x => {return {userId:req.user.id,skill:x};}) ) ; 
                req.response_data = {status: 201};
                next() ; 
            }
            catch(err){
                next(err) ; 
            }
        }, refreshJWT);

        router.post('/profile/removeSkill/:skill', verifyUser, async function (req, res, next) {
            try{
                let query = {
                    where: {
                        userId: req.user.id,
                        skill: req.params.skill
                    }
                };
                let res = await db.skilledImpact.find(query);
                if(res)
                    await db.skilledImpact.destroy(query) ; 
                req.response_data = {status: 201};
                next() ; 
            }
            catch(err){
                next(err) ; 
            }
        }, refreshJWT);

    router.get('/:userId/profile/savedCampaignPosts', verifyUser, async function (req, res, next) {
        try{
            let payload = await db.campaignPostBookmarks.findAll({
                where:{userId:req.params.userId},
                include:[{
                    model:db.campaignPosts, 
                    include:getCampaignPostIncludes(req.user.id)
                }],
                limit: elementsPerPage,
                offset: elementsPerPage * (req.query.page ? req.query.page : 0),
                order: [['updatedAt','DESC']]
            }) ;
            payload = payload.map( x => x.campaignPost ) ;
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

    router.get('/:userId/profile/inProgressCampaignPosts', verifyUser, async function (req, res, next) {
        try{
            let keys = await db.keys.findAll({
                where: { 
                    userId:req.params.userId,
                    '$campaign.isClosed$':false,
                }, 
                include: [{
                    model: db.campaigns
                }]
            });

            let payload = await db.campaignPosts.findAll({
                where: {
                    isUpdate: false,
                    campaignId: { $in: map(keys, 'campaignId') }
                },
                include: getCampaignPostIncludes(req.user.id),
                limit: elementsPerPage,
                offset: elementsPerPage * (req.query.page ? req.query.page : 0),
                order: [['updatedAt', 'DESC']]
            });

            req.response_data = {
                payload,
                status: 200
            };
            next() ; 
        }
        catch(err){
            next(err) ; 
        }
    } , refreshJWT);

    router.get('/:userId/profile/completedCampaignPosts', verifyUser, async function (req, res, next) {
        try {
            let keys = await db.keys.findAll({
                where: {
                    userId: req.params.userId,
                    '$campaign.isClosed$': true,
                },
                include: [{
                    model: db.campaigns
                }]
            });

            let payload = await db.campaignPosts.findAll({
                where: {
                    isUpdate: false,
                    campaignId: { $in: map(keys, 'campaignId') }
                },
                include: getCampaignPostIncludes(req.user.id),
                limit: elementsPerPage,
                offset: elementsPerPage * (req.query.page ? req.query.page : 0),
                order: [['updatedAt', 'DESC']]
            });

            req.response_data = {
                payload,
                status: 200
            };
            next();
        }
        catch(err){
            next(err) ; 
        }
    } , refreshJWT);

// --------------- Conservation Organization ----------------------

    router.get('/:userId/profile/organizationDetails', verifyUser, async function (req, res, next) {
        try{
            let payload = await db.organizationDetail.findOne({
                where:{
                    userId:req.params.userId
                }
            });
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

    router.get('/:userId/profile/liveFeed', verifyUser, async function (req, res, next) {
        try {
            let campaignPosts = await db.campaignPosts.findAll({
                where: {'$campaign.userId$':req.params.userId},
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

    router.get('/:userId/profile/shortTermNeeds', verifyUser, async function (req, res, next) {
        try {
            let campaignPosts = await db.campaignPosts.findAll({
                where: {
                    '$campaign.userId$':req.params.userId,
                    [db.Sequelize.Op.not]: {'$campaign.urgencyLevel$':'longterm'},
                },
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

    router.get('/:userId/profile/longTermNeeds', verifyUser, async function (req, res, next) {
        try {
            let campaignPosts = await db.campaignPosts.findAll({
                where: {
                    '$campaign.urgencyLevel$':'longterm',
                    '$campaign.userId$':req.params.userId
                },
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

    router.get('/:userId/profile/bigIssues', verifyUser, async function (req, res, next) {
        try{
            let payload = await db.bigIssues.findAll({
                where:{
                    userId:req.params.userId
                }
            });
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