var express = require('express');
var router = express.Router();
var verifyUser = require('../../../middleware/auth/verifyUser');
var refreshJWT = require('../../../middleware/auth/refreshJWT');

var {db}  = require('../../../db/models');
var bcrypt = require('bcryptjs') ;

router.use('/auth', require('./auth'));

router.get('/:userId', verifyUser, async function(req, res, next) {
    try{
        let payload = await db.users.findOne({
            where:{id:req.params.userId},
            attributes:['id','username','email']
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

router.patch('/update', verifyUser, async function (req, res, next) {
    try {
        if(req.body.password) { 
            req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10) ) ; 
        }
        let result = await db.users.update(
          req.body,{
            where: {
              id:req.user.id
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
}, refreshJWT);


module.exports = router;