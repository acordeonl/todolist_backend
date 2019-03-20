/** 
 * @module middleware/auth/refreshJWT
 * */
const jwt = require('jsonwebtoken') ; 
const {JWT_SECRET,JWT_EXPIRATION} = require('../../config/userAuth') ; 

/**
* Middleware handling API response considering access token management
* @param {Object} req express.js request object
* @param {Object} res express.js response object
* @param {Object} next express.js middleware
*/
module.exports = (req, res, next) => {
    let new_jwt = jwt.sign({
        id:req.user.id,
        isOrganization:req.user.isOrganization
    }, JWT_SECRET , {expiresIn:JWT_EXPIRATION}); 
    res.status(req.response_data.status).json({
        payload:req.response_data.payload,
        user_message:req.response_data.user_message,
        dev_message:req.response_data.dev_message,
        access_token:new_jwt
    }) ; 
};   