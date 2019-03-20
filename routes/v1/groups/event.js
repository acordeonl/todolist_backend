var express = require('express');
var router = express.Router();

var kc_toggle = require('../../../helpers/kc_toggle');
var verifyUser = require('../../../middleware/auth/verifyUser');
var refreshJWT = require('../../../middleware/auth/refreshJWT');

var {db} = require('../../../db/models');

let elementsPerPage = 5;

// --------------- Going ----------------------
    router.post('/:groupEventId/toggleGoing', verifyUser, async function (req, res, next) {
        try{
            await kc_toggle(db.groupEventGoings,{
                userId:req.user.id,
                groupEventId:req.params.groupEventId
            }) ; 
            req.response_data = {status: 201};
            next() ; 
        }
        catch(err){
            next(err) ; 
        }
    }, refreshJWT);

    router.get('/:groupEventId/going', verifyUser, async function(req, res, next) {
        try{
            let payload = (await db.groupEventGoings.findAll({
                where:{
                    groupEventId:req.params.groupEventId
                }, 
                include:[{
                    model:db.users,
                    attributes:['id','username','name','mediaPath','isOrganization']
                }],
                limit: elementsPerPage,
                offset: elementsPerPage * (req.query.page ? req.query.page : 0),
                order: [['updatedAt','DESC']]
            })).map(x=>x.user) ;
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

// --------------- Interested ----------------------
    router.post('/:groupEventId/toggleInterested', verifyUser, async function (req, res, next) {
        try{
            await kc_toggle(db.groupEventInteresteds,{
                userId:req.user.id,
                groupEventId:req.params.groupEventId
            }) ; 
            req.response_data = {status: 201};
            next() ; 
        }
        catch(err){
            next(err) ; 
        }
    }, refreshJWT);

    router.get('/:groupEventId/interested', verifyUser, async function(req, res, next) {
        try{
            let payload = (await db.groupEventInteresteds.findAll({
                where:{
                    groupEventId:req.params.groupEventId
                }, 
                include:[{
                    model:db.users,
                    attributes:['id','username','name','mediaPath','isOrganization']
                }],
                limit: elementsPerPage,
                offset: elementsPerPage * (req.query.page ? req.query.page : 0),
                order: [['updatedAt','DESC']]
            })).map(x=>x.user);
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