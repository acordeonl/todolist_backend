var express = require('express');
var router = express.Router();

var verifyUser = require('../../middleware/auth/verifyUser');
var refreshJWT = require('../../middleware/auth/refreshJWT');

var {db}  = require('../../db/models');
var elementsPerPage = 10;   

router.get('/list', verifyUser, async function (req, res, next) {
    try {
        let page = req.query.page ; 
        let entity = req.baseUrl.replace(/^\/v1\//,'') ; 
        if(page === undefined)
            page = 0 ; 
        let data = await db[entity].findAll({
            where: {
                userId: req.user.id
            },
            // offset: page * elementsPerPage,
            // limit: elementsPerPage
        });
        req.response_data = {
            status: 200,
            payload:data
        };
        next() ; 
    } catch (err) {
        next(err);
    }
} ,refreshJWT);

router.get('/:entityId', verifyUser, async function(req, res, next) {
    try{
        let entityId = req.params.entityId ; 
        let entity = req.baseUrl.replace(/^\/v1\//,'') ;
        let data = await db[entity].find({where:{
            id:entityId,
            userId:req.user.id
        }}) ; 
        req.response_data = {
            status: 200,
            payload:data
        };
        next() ; 
    }
    catch(err){
        next(err) ; 
    }
} , refreshJWT);

router.post('/', verifyUser, async function(req, res, next) {
    try{
        let entity = req.baseUrl.replace(/^\/v1\//,'') ;
        req.body.userId = req.user.id ;
        let data = await db[entity].create(req.body) ; 
        req.response_data = {
            status: 200,
            payload:data
        };
        next() ; 
    }
    catch(err){
        next(err) ; 
    }
} , refreshJWT);

router.patch('/:entityId', verifyUser, async function (req, res, next) {
    try {
        let entityId = req.params.entityId ;
        let entity = req.baseUrl.replace(/^\/v1\//,'') ; 
        let result = await db[entity].update(
          req.body,{
            where: {
              id:entityId,
              userId:req.user.id
            }
        }) ;
        req.response_data = {
            dev_message:`Updated rows: ${result[0]}`,
            status: 200,
        };
        next() ;
    } catch (err) {
        next(err);
    }
} , refreshJWT);

router.delete('/:entityId' , verifyUser, async function (req, res, next) {
    try {
        var entityId = req.params.entityId ;
        let entity = req.baseUrl.replace(/^\/v1\//,'') ; 
        let result = await db[entity].destroy(
          {where: {
              id:entityId,
              userId:req.user.id
            }}
        ) ;
        req.response_data = {
            dev_message:`Deleted rows: ${result}`,
            status: 200
        };
        next() ; 
    } catch (err) {
        next(err);
    }
} , refreshJWT );


module.exports = router;