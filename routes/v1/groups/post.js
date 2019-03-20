var express = require('express');
var router = express.Router();

var kc_toggle = require('../../../helpers/kc_toggle');
var verifyUser = require('../../../middleware/auth/verifyUser');
var refreshJWT = require('../../../middleware/auth/refreshJWT');

var {db} = require('../../../db/models');

let elementsPerPage = 5;

router.get('/:groupPostId/details', verifyUser, async function (req, res, next) {
    try{
        let commentsCount = await db.groupPostComments.count({where:{groupPostId:req.params.groupPostId}}) ; 
        let likesCount = await db.groupPostLikes.count({where:{groupPostId:req.params.groupPostId}}) ; 
        req.response_data = {
            payload: {
                commentsCount,
                likesCount
            },
            status: 200
        };
        next() ;
    }catch(err){
        next(err) ; 
    }
}, refreshJWT);

router.post('/:groupPostId/toggleLike', verifyUser, async function (req, res, next) {
    try{
        await kc_toggle(db.groupPostLikes,{
            userId:req.user.id,
            groupPostId:req.params.groupPostId
        }) ; 
        req.response_data = {status: 201};
        next() ; 
    }
    catch(err){
        next(err) ; 
    }
}, refreshJWT);

router.post('/:groupPostId/addComment', verifyUser, async function (req, res, next) {
    try{
        await db.groupPostComments.create({
            userId:req.user.id,
            groupPostId:req.params.groupPostId,
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

router.get('/:groupPostId/allComments', verifyUser, async function (req, res, next) {
    try{
        let payload = await db.groupPostComments.findAll({
            where:{
                groupPostId:req.params.groupPostId
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

module.exports = router;