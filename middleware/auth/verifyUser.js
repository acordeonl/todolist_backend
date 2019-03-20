/** 
 * @module middleware/auth/verifyUser
 * */
const jwt = require('jsonwebtoken') ; 
const {JWT_SECRET} = require('../../config/userAuth') ; 
const {messages_authorization} = require('../../config/en_user_messages') ;
var handleBasicAuth = require('../../helpers/handleBasicAuth') ; 

/**
* Middleware for handling user authentication
* @param {Object} req express.js request object
* @param {Object} res express.js response object
* @param {Object} next express.js middleware
*/
module.exports = async (req, res, next) => {
    try{
        let auth = req.headers.authorization.split(' ') ; 
        if (auth[0] === 'Basic'){
            let credentials = Buffer.from(auth[1], 'base64').toString('ascii').split(':') ; 
            let email = credentials[0] ; 
            let password = credentials[1] ; 
            let {status,user} = await handleBasicAuth(email,password) ; 
            if(status !== 200)
                throw new Error(`Invalid credentials`);
            req.user = user ; 
            next()  ; 
        }
        else if (auth[0] === 'Bearer'){
            req.user = jwt.verify(auth[1], JWT_SECRET) ; 
            next() ; 
        }
        else {
            throw 'ER_INVALID_TOKEN' ; 
        }
    }
    catch(err){
        res.status(401).json({
            dev_message: messages_authorization.dev_token_no_valido
        });
    }
};