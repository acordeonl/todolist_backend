var express = require('express');
var router = express.Router();
const {messages_authentication} = require('../../../config/en_user_messages') ;
var {db}  = require('../../../db/models');
var createUser = require('../../../helpers/createUser'); 
var handleBasicAuth = require('../../../helpers/handleBasicAuth') ; 

// --------------- Email Login ----------------------
    router.post('/signUp', async function (req, res, next) {
        try {
            let user = await db.users.find({
                where:{
                    email:req.body.email
                }
            }) ; 
            if(!user){
                user = await createUser(req.body); 
                res.json({
                    dev_message:'user created'
                }) ;
            }
            else{
                res.json({
                    dev_message:'user already exists'
                }) ;
            }
        } catch (err) {
            next(err) ; 
        }
    });

    router.post('/emailLogin' , async function (req, res, next) {
        try{
            if (req.body.email !== undefined && req.body.password !== undefined) {
                let {status,user,access_token} = await handleBasicAuth(req.body.email,req.body.password) ; 
                if(status === 200) { 
                    res.status(200).json({
                        payload:user,
                        user_message: messages_authentication.credenciales_validas,
                        access_token
                    });
                }
                else {
                    res.status(401).json({
                        user_message: messages_authentication.credenciales_no_validas
                    });
                }
            } else if (req.body.email !== undefined){
                res.status(400).json({
                    user_message: messages_authentication.faltan_campos
                });
            }
            else {
                res.status(400).json({
                    user_message: messages_authentication.faltan_campos
                });
            }
        } catch(err){
            next(err)  ; 
        }
    });


module.exports = router;