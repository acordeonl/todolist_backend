var express = require('express');
var router = express.Router();
var { map } = require('lodash');

var verifyUser = require('../../../middleware/auth/verifyUser');
var refreshJWT = require('../../../middleware/auth/refreshJWT');
var {db} = require('../../../db/models');
var getCampaignPostIncludes = require ('../../../helpers/campaignPostIncludes') ; 

var elementsPerPage = 5;

router.get('/skills/:skill', verifyUser, async function(req, res, next) {
    try{
        let payload = await db.campaignPosts.findAll({
            where: {'$isUpdate$':false},
            include: getCampaignPostIncludes(req.user.id , {
                campaignIncludes:{
                    model: db.skillNeeds,
                    attributes: ['name'],
                    where:{ name:{[db.Sequelize.Op.iLike]: `%${req.params.skill}%`}}
                }
            }),
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

router.get('/hashtag/:hashtag', verifyUser, async function(req, res, next) {
    try{
        let payload = await db.campaignPosts.findAll({
            where: {'$isUpdate$':false},
            include: getCampaignPostIncludes(req.user.id , {
                campaignIncludes:{
                    model: db.tags,
                    attributes: ['name'],
                    where:{ name:{[db.Sequelize.Op.iLike]: `%${req.params.hashtag}%`}}
                }
            }),
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

router.get('/inPerson', verifyUser, async function(req, res, next) {
    try{
        let inPersonNeeds = await db.inPersonNeeds.findAll({
            where: 
                db.sequelize.literal(`3961* 2 * 
                    atan2(sqrt((pow(sin(radians(${req.query.latitude} - "inPersonNeeds"."latitude") / 2), 2) +
                    cos(radians("inPersonNeeds"."latitude")) * cos(radians(${req.query.latitude})) *
                    pow(sin(radians(${req.query.longitude} - "inPersonNeeds"."longitude") / 2), 2))), 
                    sqrt(1 - (pow(sin(radians(${req.query.latitude} - "inPersonNeeds"."latitude") / 2), 2) +
                    cos(radians("inPersonNeeds"."latitude")) * cos(radians(${req.query.latitude})) *
                    pow(sin(radians(${req.query.longitude} - "inPersonNeeds"."longitude") / 2), 2)))) 
                    <= ${req.query.radius} `
                )
        }) ; 
        let payload = await db.campaignPosts.findAll({
            where: {'$isUpdate$':false},
            include: getCampaignPostIncludes(req.user.id , {
                campaignIncludes:{
                    model: db.inPersonNeeds,
                    attributes:['id'] , 
                    where: {
                        id: {
                          $in: map(inPersonNeeds, 'id'),
                        }
                    }
                }
            }),
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

router.get('/campaignName/:campaignName', verifyUser, async function(req, res, next) {
    try{
        let payload = await db.campaignPosts.findAll({
            where: {
                '$campaign.name$':{[db.Sequelize.Op.iLike]: `%${req.params.campaignName}%`},
                '$isUpdate$':false
            },
            include: getCampaignPostIncludes(req.user.id),
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