var express = require('express');
var router = express.Router();

var verifyUser = require('../../middleware/auth/verifyUser');
var refreshJWT = require('../../middleware/auth/refreshJWT');

var {db}  = require('../../db/models');

let elementsPerPage = 10 ; 

router.get('/count', verifyUser, async function(req, res, next) {
    try{
        let payload = await db.skilledImpact.findAll({
              attributes: ['skill', [db.sequelize.fn('count', db.sequelize.col('skill')), 'members']],
              group: ['skill'],
              order:[[db.sequelize.literal('members'),'DESC']],
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

router.get('/members/:skill', verifyUser, async function(req, res, next) {
    try{
        let payload = await db.skilledImpact.findAll({
            where:{skill:req.params.skill},
            include:[{
                model:db.users,
                attributes:['id','username','name','mediaPath','isOrganization'],
            }],
            limit: elementsPerPage,
            offset: elementsPerPage * (req.query.page ? req.query.page : 0),
            order: [['updatedAt','DESC']]
        }) ;
        payload = payload.map(member => member.user) ; 
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