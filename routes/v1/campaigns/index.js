var express = require('express');
var router = express.Router();
var moment = require('moment') ;

var { notifyTaggedUsers , notifySupporters } = require('../../../helpers/campaignPostNotifications') ; 
var verifyUser = require('../../../middleware/auth/verifyUser');
var refreshJWT = require('../../../middleware/auth/refreshJWT');

let elementsPerPage = 10 ; 
var {db} = require('../../../db/models');

router.use('/post', require('./post'));
router.use('/support', require('./support'));

router.post('/update/:campaignId', verifyUser, async function(req, res, next) {
    try{
        if(!req.user.isOrganization) {
            req.response_data = {
                status: 400, 
                dev_message:'user must be an oragnization'
            };
            next() ; 
            return ;     
        }
        let user = await db.users.findOne({where:{id:req.user.id}}) ;
        let post = await db.campaignPosts.create({
            ...req.body.campaignPost,
            isUpdate:true,
            campaignId:req.params.campaignId
        }) ;
        let campaign = await db.campaigns.findOne({where:{id:req.params.campaignId}}) ;
        notifySupporters( user , campaign ) ;
        notifyTaggedUsers ( user , post ) ;
        req.response_data = {
            status: 200
        };
        next() ; 
    }
    catch(err){
        next(err) ; 
    }
} , refreshJWT);

// --------------- Main ----------------------

    router.get('/openCampaigns', verifyUser, async function (req, res, next) {
        try{
            let payload = await db.campaigns.findAll({
                where:{
                    userId:req.user.id,
                    isClosed:false
                },
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

    router.get('/closedCampaigns/:queryType', verifyUser, async function (req, res, next) {
        try {
            let startMonthAgo = 1 , endMonthAgo = 0;
            if(req.params.queryType === '2-5MonthsAgo') {
                startMonthAgo = 5 ; 
                endMonthAgo = 2 ; 
            }
            else if(req.params.queryType === '6+MonthsAgo') {
                startMonthAgo = 600 ; 
                endMonthAgo = 6 ; 
            }
            let payload = await db.campaigns.findAll({
                where: {
                    userId: req.user.id,
                    isClosed: true,
                    createdAt: {
                        [db.Sequelize.Op.between]: [
                            moment().subtract(startMonthAgo, 'months').toDate(),
                            moment().subtract(endMonthAgo, 'months').toDate()
                        ]
                    }
                },
                limit: elementsPerPage,
                offset: elementsPerPage * (req.query.page ? req.query.page : 0),
                order: [['updatedAt','DESC']]
            });
            req.response_data = {
                payload,
                status: 200
            };
            next();
        } catch (err) {
            next(err);
        }
    }, refreshJWT);

// --------------- Campaign Details ----------------------

    router.get('/:need/:campaignId', verifyUser, async function (req, res, next) {
        try{
            let payload = await db[req.params.need].findAll({
                where:{
                    campaignId:req.params.campaignId
                },
                include:[{
                    model:db.campaignSupport,
                    attributes: ['moneyAmmount'],
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

    router.get('/support/:need/:needId', verifyUser, async function (req, res, next) {
        try{
            let query = {} ;
            query[req.params.need+'Id'] = req.params.needId ;
            let payload = await db.campaignSupport.findAll({
                where:query,
                include:[{
                    model: db.users,
                    attributes:['id','username','name','mediaPath','isOrganization'],
                }],
                limit: elementsPerPage,
                offset: elementsPerPage * (req.query.page ? req.query.page : 0),
                order: [['updatedAt','DESC']],
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