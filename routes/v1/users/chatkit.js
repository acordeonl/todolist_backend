var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var verifyUser = require('../../../middleware/auth/verifyUser');
var refreshJWT = require('../../../middleware/auth/refreshJWT');
var createChatRoom = require('../../../helpers/createChatRoom') ;
var {db}  = require('../../../db/models');

const Chatkit = require('@pusher/chatkit-server');
const chatkit = new Chatkit.default({
    instanceLocator: process.env.chatkit_instance_prefix + ':' + process.env.chatkit_instance,
    key: process.env.chatkit_secret_key_id + ':' + process.env.chatkit_secret_key
});

// used for chatkit room management in frontend
chatkit.updatePermissionsForGlobalRole({
    name: 'default',
    permissionsToAdd: ['room:update']
})
    .then(() => console.log('updated chatkit default role'))
    .catch(err => console.error(err)); 

router.post('/auth', verifyUser, async function (req, res, next) {
    try {
        // chatkit_token_expiry can't be greater than 86400
        res.json({
            access_token: jwt.sign({
                instance: process.env.chatkit_instance,
                iss: `api_keys/${process.env.chatkit_secret_key_id}`,
                sub: `User${req.user.id}`
            }, process.env.chatkit_secret_key, {
                expiresIn: process.env.chatkit_token_expiry + 's'
            }),
            expires_in: parseInt(process.env.chatkit_token_expiry),
            user_id: `User${req.user.id}`
        });
    } catch (err) {
        next(err);
    }
});

router.post('/createRoom/:userId', verifyUser, async function (req, res, next) {
    try {
        let room = await createChatRoom (req.user.id, req.params.userId, 'direct', {
            campaignId: null,
            inPersonNeedId: null,
            skillNeedId: null
        });
        req.response_data = {
            payload:{
                roomId:room.id
            },
            status: 200
        };
        next();
    } catch (err) {
        next(err);
    }
}, refreshJWT);

module.exports = router;