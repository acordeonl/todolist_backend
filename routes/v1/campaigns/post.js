var express = require('express');
var router = express.Router();

var kc_toggle = require('../../../helpers/kc_toggle');
var verifyUser = require('../../../middleware/auth/verifyUser');
var refreshJWT = require('../../../middleware/auth/refreshJWT');
var getCampaignPostIncludes = require ('../../../helpers/campaignPostIncludes') ; 


var {db} = require('../../../db/models');

let elementsPerPage = 5;

    router.get('/:campaignPostId', verifyUser, async function(req, res, next) {
        try{
            let payload = await db.campaignPosts.findOne({
                where:{id:req.params.campaignPostId},
                include: getCampaignPostIncludes(req.user.id)
            }) ;
            req.response_data = {
                status: 200,
                payload
            };
            next() ; 
        }
        catch(err){
            next(err) ; 
        }
    } , refreshJWT);
    
// --------------- Interactions ----------------------
    router.post('/:campaignPostId/addComment', verifyUser, async function (req, res, next) {
        try{
            await db.campaignPostComments.create({
                userId:req.user.id,
                campaignPostId:req.params.campaignPostId,
                content:req.body.content
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

    router.get('/:campaignPostId/allComments', verifyUser, async function (req, res, next) {
        try{
            let payload = await db.campaignPostComments.findAll({
                where:{
                    campaignPostId:req.params.campaignPostId
                },
                attributes: {exclude: ['userId']},
                include:[{
                    model: db.users,
                    attributes:['id','username','name','mediaPath','isOrganization'],
                }],
                limit: elementsPerPage,
                offset: elementsPerPage * (req.query.page ? req.query.page : 0),
                order: [['updatedAt','ASC']]
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

    router.get('/:campaignPostId/details', verifyUser, async function (req, res, next) {
        try{
            let campaignId = (await db.campaignPosts.find({where:{id:req.params.campaignPostId}})).campaignId ;
            let numberSupporters = await db.keys.count({where:{campaignId:campaignId}}) ;
            let commentsCount = await db.campaignPostComments.count({where:{campaignPostId:req.params.campaignPostId}}) ; 
            let firstComment = await db.campaignPostComments.find({
                where:{campaignPostId:req.params.campaignPostId},
                attributes: {exclude: ['userId']},
                include:[{
                    model: db.users,
                    attributes:['id','username','name','mediaPath','isOrganization']
                }],
                order: [
                    ['createdAt', 'DESC']
                ]
            });
            req.response_data = {
                payload: {
                    numberSupporters,
                    commentsCount,
                    firstComment
                },
                status: 200
            };
            next() ;
        }catch(err){
            next(err) ; 
        }
    }, refreshJWT);

    router.post('/:campaignPostId/toggleBookmark', verifyUser, async function (req, res, next) {
        try{
            await kc_toggle(db.campaignPostBookmarks,{
                userId:req.user.id,
                campaignPostId:req.params.campaignPostId
            }) ; 
            req.response_data = {status: 201};
            next() ; 
        }
        catch(err){
            next(err) ; 
        }
    }, refreshJWT);

    router.post('/:campaignPostId/toggleLike', verifyUser, async function (req, res, next) {
        try{
            await kc_toggle(db.campaignPostLikes,{
                userId:req.user.id,
                campaignPostId:req.params.campaignPostId
            }) ; 
            req.response_data = {status: 201};
            next() ; 
        }
        catch(err){
            next(err) ; 
        }
    }, refreshJWT);
// --------------- Campaign Support ----------------------
    router.get('/supporters/:campaignId', verifyUser, async function(req, res, next) {
        try{
            let query = {campaignId:req.params.campaignId} ; 
            if(req.query.supportType) 
                query.supportType = req.query.supportType ; 
            let payload = await db.campaignSupport.findAll({
                where:query,
                include:[{
                    model:db.moneyNeeds
                },{
                    model:db.skillNeeds
                },{
                    model:db.inPersonNeeds
                },{
                    model: db.users,
                    attributes:['id','username','name','mediaPath','isOrganization'],
                }],
                limit: elementsPerPage,
                offset: elementsPerPage * (req.query.page ? req.query.page : 0),
                order: [['updatedAt','DESC']]
            });
            req.response_data = {
                status: 200,
                payload
            };
            next() ; 
        }
        catch(err){
            next(err) ; 
        }
    } , refreshJWT);

    router.get('/skills/supporters/:campaignId', verifyUser, async function(req, res, next) {
        try{
            let payload = await db.campaignSupport.findAll({
                where:{
                    campaignId:req.params.campaignId,
                    supportType:'skill',
                    '$skillNeed.name$':{[db.Sequelize.Op.iLike]: `%${req.query.skill}%`}
                },
                include:[{
                    model:db.moneyNeeds
                },{
                    model:db.skillNeeds
                },{
                    model:db.inPersonNeeds
                },{
                    model: db.users,
                    attributes:['id','username','name','mediaPath','isOrganization'],
                }],
                limit: elementsPerPage,
                offset: elementsPerPage * (req.query.page ? req.query.page : 0),
                order: [['updatedAt','DESC']]
            });
            req.response_data = {
                status: 200,
                payload
            };
            next() ; 
        }
        catch(err){
            next(err) ; 
        }
    } , refreshJWT);
    

module.exports = router;