/** 
 * @module helpers/handleBasicAuth
 * */
var bcrypt = require('bcryptjs') ;
var jwt = require('jsonwebtoken') ; 
var {db}  = require('../db/models');
const { JWT_SECRET , JWT_EXPIRATION } = require('../config/userAuth') ; 

/**
 * Logs in user using basic authentication
 * @param {string} email user's email
 * @param {string} password user's password
 */
module.exports = async function handleBasicAuth (email,password,isOrganization) { 
    let user = await db.users.find({
        where:{
            email,
            isOrganization
        }
    }) ; 
    // compare password with hash saved on database
    if (user !== null && user.password && bcrypt.compareSync(password, user.password)) {
        // respond with new access token for loggued in user
        let access_token = jwt.sign({
            id:user.id,
            isOrganization: user.isOrganization
        }, JWT_SECRET , {expiresIn:JWT_EXPIRATION}); 
        return {
            status:200,
            user,
            access_token
        };
    } else {
        return {
            status:400
        };
    }
};