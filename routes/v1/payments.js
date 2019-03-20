var express = require('express');
var fetch = require('node-fetch');
var {db}  = require('../../db/models');
var stripe = require("stripe")(process.env.stripe_secret_key);  

var router = express.Router();

router.get('/connect', async function (req, res, next) { 
    try{
        let result = await (await fetch(`https://connect.stripe.com/oauth/token`, {
            method: 'POST',
            body: JSON.stringify({
                client_secret: process.env.stripe_secret_key,
                code: req.query.code,
                grant_type: 'authorization_code'
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        })).json();
        let account = await stripe.accounts.retrieve(result.stripe_user_id) ; 
        let user = await db.users.findOne({where:{email:account.email}}) ; 
        if(user && user.isOrganization) {
            await db.users.update({stripeUserId:result.stripe_user_id} , {where:{email:user.email}}) ;
            res.send('updated user '+user.email) ; 
        }
        else 
            res.send('Bad request from '+account.email) ; 
    }
    catch(err){
        console.log(err);
        next(err) ; 
    }
});

module.exports = router;