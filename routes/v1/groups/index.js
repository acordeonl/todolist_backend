var express = require('express');
var router = express.Router();

var verifyUser = require('../../../middleware/auth/verifyUser');
var refreshJWT = require('../../../middleware/auth/refreshJWT');

var {db}  = require('../../../db/models');

let elementsPerPage = 5 ; 

router.get('/', verifyUser, async function(req, res, next) {
    try{
        let payload = await db.groups.findAll({
            limit: elementsPerPage,
            offset: elementsPerPage * (req.query.page ? req.query.page : 0),
            order: [['updatedAt','DESC']]
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

router.post('/', verifyUser, async function(req, res, next) {
    try{
        let group = await db.groups.create({
            ...req.body.group, 
            adminUserId:req.user.id
        }) ; 
        await db.groupMembers.create({
            groupId:group.id, 
            userId:req.user.id
        }) ;
        req.response_data = {
            status: 200
        };
        next() ; 
    }
    catch(err){
        next(err) ; 
    }
} , refreshJWT);

router.get('/:groupId/details', verifyUser, async function(req, res, next) {
    try{
        let result = await db.groupMembers.findOne({
            where:{
                groupId:req.params.groupId,
                userId:req.user.id
            }
        }) ;
        let joined = result !== null ; 
        let membersCount = await db.groupMembers.count({where:{groupId:req.params.groupId}}) ; 
        let upcomingEvents = await db.groupEvents.count({
            where:{
                groupId:req.params.groupId,
                date: {[db.Sequelize.Op.gt]: new Date()}
            }
        }) ;
        req.response_data = {
            status: 200,
            payload:{
                joined,
                membersCount,
                upcomingEvents
            }
        };
        next() ; 
    }
    catch(err){
        next(err) ; 
    }
} , refreshJWT);

router.get('/local', verifyUser, async function (req, res, next) {
    try{
        let payload = await db.groups.findAll({
            where: 
                db.sequelize.literal(`
                    3961* 2 * 
                    atan2(sqrt((pow(sin(radians(${req.query.latitude} - "groups"."latitude") / 2), 2) +
                    cos(radians("groups"."latitude")) * cos(radians(${req.query.latitude})) *
                    pow(sin(radians(${req.query.longitude} - "groups"."longitude") / 2), 2))), 
                    sqrt(1 - (pow(sin(radians(${req.query.latitude} - "groups"."latitude") / 2), 2) +
                    cos(radians("groups"."latitude")) * cos(radians(${req.query.latitude})) *
                    pow(sin(radians(${req.query.longitude} - "groups"."longitude") / 2), 2)))) 
                    <= ${req.query.radius}
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

// --------------- Members ----------------------
    router.post('/:groupId/join', verifyUser, async function(req, res, next) {
        try{
            let result = await db.groupMembers.findOrCreate({
                where:{
                    groupId:req.params.groupId,
                    userId:req.user.id
                },
                defaults:{
                    groupId:req.params.groupId,
                    userId:req.user.id
                }
            }) ;
            let status = 201 ;
            let dev_message = 'user joined group';
            if(!result[1]) {
                status = 400 ;
                dev_message = 'user is already in group';
            }
            req.response_data = {
                status,
                dev_message
            };
            next() ; 
        }
        catch(err){
            next(err) ; 
        }
    } , refreshJWT);

    router.post('/:groupId/leave', verifyUser, async function(req, res, next) {
        try{
            let result = await db.groupMembers.destroy({where:{userId:req.user.id}}) ;
            let dev_message = result ? 'user left group':"user wasn't in group" ;  
            req.response_data = {
                status: 200,
                dev_message
            };
            next() ; 
        }
        catch(err){
            next(err) ; 
        }
    } , refreshJWT);

    router.get('/:groupId/members', verifyUser, async function(req, res, next) {
        try{
            let payload = (await db.groupMembers.findAll({
                where:{groupId:req.params.groupId},
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

    router.get('/:groupId/members/:query', verifyUser, async function (req, res, next) {
        try{
            let payload = await db.groupMembers.findAll({
                where:{groupId:req.params.groupId},
                include:[{
                    model:db.users,
                    attributes:['id','username','name','mediaPath','isOrganization'],
                    where:{
                        [db.Sequelize.Op.or]:{
                            username:req.params.query,
                            name: {
                              [db.Sequelize.Op.iLike]: `%${req.params.query}%`
                            }
                        }
                    }
                }],
                limit: elementsPerPage,
                offset: elementsPerPage * (req.query.page ? req.query.page : 0),
                order: [['updatedAt','DESC']]
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

// --------------- Posts ----------------------
    router.use('/post', require('./post'));

    router.post('/:groupId/posts', verifyUser, async function(req, res, next) {
        try{
            await db.groupPosts.create({
                ...req.body.post, 
                userId:req.user.id,
                groupId:req.params.groupId
            });
            req.response_data = {
                status: 200
            };
            next() ; 
        }
        catch(err){
            next(err) ; 
        }
    } , refreshJWT);

    router.get('/:groupId/posts', verifyUser, async function(req, res, next) {
        try{
            let payload = await db.groupPosts.findAll({
                where:{groupId:req.params.groupId}, 
                include:[{
                    model:db.users,
                    attributes:['id','username','name','mediaPath','isOrganization']
                },{
                    model: db.groupPostLikes,
                    attributes: ['id'],
                    where: {
                        userId: req.user.id
                    },
                    required: false,
                    duplicating: false
                }],
                limit: elementsPerPage,
                offset: elementsPerPage * (req.query.page ? req.query.page : 0),
                order: [['updatedAt','DESC']]
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

// --------------- Events ----------------------
    router.use('/event', require('./event'));

    router.get('/:groupId/upcomingEvents', verifyUser, async function(req, res, next) {
        try{
            let payload = await db.groupEvents.findAll({
                where:{
                    groupId:req.params.groupId,
                    date: {[db.Sequelize.Op.gt]: new Date()}
                },
                limit: elementsPerPage,
                offset: elementsPerPage * (req.query.page ? req.query.page : 0),
                order: [['updatedAt','DESC']]
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

    router.get('/:groupId/pastEvents', verifyUser, async function(req, res, next) {
        try{
            let payload = await db.groupEvents.findAll({
                where:{
                    groupId:req.params.groupId,
                    date: {[db.Sequelize.Op.lt]: new Date()}
                },
                limit: elementsPerPage,
                offset: elementsPerPage * (req.query.page ? req.query.page : 0),
                order: [['updatedAt','DESC']]
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

    router.post('/:groupId/events', verifyUser, async function(req, res, next) {
        try{
            await db.groupEvents.create({
                ...req.body.event,
                groupId:req.params.groupId
            });
            req.response_data = {
                status: 200
            };
            next() ; 
        }
        catch(err){
            next(err) ; 
        }
    } , refreshJWT);    

    router.get('/:groupId/events', verifyUser, async function(req, res, next) {
        try{
            let payload = await db.groupEvents.findAll({
                where:{
                    groupId:req.params.groupId
                }, 
                limit: elementsPerPage,
                offset: elementsPerPage * (req.query.page ? req.query.page : 0),
                order: [['updatedAt','DESC']]
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

module.exports = router;