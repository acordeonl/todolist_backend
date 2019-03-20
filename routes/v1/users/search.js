var express = require('express');
var router = express.Router();

var verifyUser = require('../../../middleware/auth/verifyUser');
var refreshJWT = require('../../../middleware/auth/refreshJWT');

var {db}  = require('../../../db/models');


router.get('/:query', verifyUser, async function (req, res, next) {
    try{
        let payload = await db.users.findAll({
            where:{
                [db.Sequelize.Op.or]:{
                    username:{
                        [db.Sequelize.Op.iLike]: `%${req.params.query}%`
                    },
                    name: {
                        [db.Sequelize.Op.iLike]: `%${req.params.query}%`
                    }
                }
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

router.get('/organizations/location/', verifyUser, async function (req, res, next) {
    try{
        // single line haversine formula in miles
        // https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
        let payload = await db.users.findAll({
            where: 
                db.sequelize.literal(`
                    3961* 2 * 
                    atan2(sqrt((pow(sin(radians(${req.query.latitude} - "users"."latitude") / 2), 2) +
                    cos(radians("users"."latitude")) * cos(radians(${req.query.latitude})) *
                    pow(sin(radians(${req.query.longitude} - "users"."longitude") / 2), 2))), 
                    sqrt(1 - (pow(sin(radians(${req.query.latitude} - "users"."latitude") / 2), 2) +
                    cos(radians("users"."latitude")) * cos(radians(${req.query.latitude})) *
                    pow(sin(radians(${req.query.longitude} - "users"."longitude") / 2), 2)))) 
                    <= ${req.query.radius} AND "users"."isOrganization" = true 
                `)
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
} , refreshJWT);

router.get('/organizations/displayLocation', verifyUser, async function (req, res, next) {
    try{
        let payload = await db.users.findAll({
            where:{displayLocation: {[db.Sequelize.Op.iLike]: `%${req.query.displayLocation}%`}}
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
} , refreshJWT);

router.get('/hashtag/:hashtag', verifyUser, async function(req, res, next) {
    try{
        let payload = await db.tags.findAll({
            where: { name: { [db.Sequelize.Op.iLike]: `%${req.params.hashtag}%` } },
            attributes: ['userId', [db.sequelize.fn('count', db.sequelize.col('userId')), 'relevance']],
            include:[{
                model:db.users,
                attributes:['id','username','name','mediaPath','isOrganization']
            }],
            group: ['userId','user.id'],
            order: [[db.sequelize.literal('relevance'), 'DESC']],
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

router.get('/:userType/:query', verifyUser, async function (req, res, next) {
    try{
        let query = {
            [db.Sequelize.Op.or]:{
                username:{
                    [db.Sequelize.Op.iLike]: `%${req.params.query}%`
                },
                name: {
                    [db.Sequelize.Op.iLike]: `%${req.params.query}%`
                }
            },
            isOrganization:false
        } ; 
        if(req.params.userType === 'organizations')
            query.isOrganization = true ; 
        let payload = await db.users.findAll({where:query});
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