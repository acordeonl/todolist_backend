/** 
 * @module middleware/auth/handleLogin
 * */
const { JWT_SECRET , JWT_EXPIRATION } = require('../../config/userAuth') ; 
const { messages_authentication } = require('../../config/en_user_messages') ;  
var jwt = require('jsonwebtoken') ; 
var {db}  = require('../../db/models');
var createUser = require('../../helpers/createUser'); 

/**
 * Middleware for handling user social signUp/login actions with passport.js
 * @param {Object} req express.js request object
 * @param {Object} res express.js response object
 * @param {Object} next express.js middleware
 */
module.exports = async (req, res, next) => {
    try{
        let user = await db.users.find({ 
            where:{
                email:req.user.emails[0].value, 
                isOrganization:req.body.isOrganization
            }
        }) ; 
        let newUser = false ;
        // Handle sign up for new users and login otherwise
        if(!user) {
            user = await createUser({
                ...req.body,
                username:req.user.displayName.replace(/\s/g,'').toLowerCase(),
                name:req.user.displayName,
                email:req.user.emails[0].value,
                mediaPath:req.user.photos[0].value,
            }) ; 
            newUser = true ; 
        }
        let token = jwt.sign({
            id:user.id,
            isOrganization: user.isOrganization
        }, JWT_SECRET , {expiresIn:JWT_EXPIRATION}); 
        res.status(200).json({
            payload:user,
            user_message: messages_authentication.credenciales_validas,
            newUser,
            access_token:token
        });
    }
    catch(err){
        next(err) ; 
    }
};