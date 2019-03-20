/** 
* @module helpers/sendCampaignPostNotifications
* */   
var {db} = require('../db/models');
var i18n = require('../config/locales') ;
var sendPushNotification = require('./sendPushNotification') ; 
var removeMd = require('remove-markdown');
var getLinks = require('markdown-link-extractor');

/**
 * Send campaign alert notifications nearby users 
 * @param  {object} user User creating post
 * @param  {object} post Created post
 * @param  {object} setRadius Radius for sending urgent alerts to nearby users
 */
module.exports.notifyNearbyUsers = async function (user, post , setRadius) {
    let postLatitude = post.latitude ; 
    let postLongitude = post.longitude ;
    // use haversine formula for calculating great circle distance
    let alertedUsers = await db.users.findAll({
        where: 
            db.sequelize.literal(`
                3961* 2 * 
                atan2(sqrt((pow(sin(radians(${postLatitude} - "users"."latitude") / 2), 2) +
                cos(radians("users"."latitude")) * cos(radians(${postLatitude})) *
                pow(sin(radians(${postLongitude} - "users"."longitude") / 2), 2))), 
                sqrt(1 - (pow(sin(radians(${postLatitude} - "users"."latitude") / 2), 2) +
                cos(radians("users"."latitude")) * cos(radians(${postLatitude})) *
                pow(sin(radians(${postLongitude} - "users"."longitude") / 2), 2)))) 
                <= ${setRadius} 
            `)
    }) ; 
    // alert nearby users
    await Promise.all(
        alertedUsers.map ( alertedUser => 
            new Promise ( async resolve => {
                let { userNotifications } = i18n[alertedUser.language] ; 
                // username and postId in eval()
                let username = user.username , postId = post.id; 
                let urgentAlertMessage =  eval('`'+userNotifications.urgentAlert+'`')   ; 
                await db.userNotifications.create({
                    type:'alert',
                    userId:alertedUser.id, 
                    mediaPath:user.mediaPath,
                    content:urgentAlertMessage
                }) ;
                await sendPushNotification(
                    alertedUser.id,
                    'keyconservation.org/notifications', 
                    'Key Conservation',
                    removeMd(urgentAlertMessage)
                );
                resolve() ;
            })
        )
    ) ;
};

/**
 * Send notifications users tagged in post description
 * @param  {object} user User creating post
 * @param  {object} post Created post
 */
module.exports.notifyTaggedUsers = async function ( user , post ){
    let links = getLinks(post.description) ; 
    // remove duplicates
    links  = [...new Set(links)] ; 
    await Promise.all(
        links.map ( link => 
            new Promise ( async resolve => {
                let tmp = link.split('/') ; 
                if(tmp[tmp.length-2] !== 'users')
                    resolve() ; 
                let taggedUserId = parseInt(tmp[tmp.length-1]) ; 
                let taggedUser = await db.users.findOne({where:{id:taggedUserId}}) ;
                let { userNotifications } = i18n[taggedUser.language] ; 
                // username and postId in eval()
                let username = user.username , postId = post.id; 
                let taggedInPostMessage =  eval('`'+userNotifications.taggedInPost+'`')   ; 
                await db.userNotifications.create({
                    type:'tag',
                    userId:taggedUserId, 
                    mediaPath:user.mediaPath,
                    content:taggedInPostMessage
                }) ;
                await sendPushNotification(
                    taggedUserId,
                    'keyconservation.org/notifications', 
                    'Key Conservation',
                    removeMd(taggedInPostMessage)
                );
                resolve() ;
            })
        )
    ) ;
} ;


/**
 * Send update notification for campaign supporters
 * @param  {object} user User creating post
 * @param  {object} campaign Campaign associated with post
 */
module.exports.notifySupporters = async function ( user , campaign ){
    let supportersKeys = await db.keys.findAll({where:{campaignId:campaign.id}}) ;
    await Promise.all(
        supportersKeys.map ( supporterKey => 
            new Promise ( async resolve => {
                let supporter = await db.users.findOne({where:{id:supporterKey.userId}}) ;
                let { userNotifications } = i18n[supporter.language] ; 
                // username, campaignId and campaignName used in eval()
                let username = user.username ;
                let campaignId = campaign.id ; 
                let campaignName = campaign.name ; 
                let campaignUpdateMessage =  eval('`'+userNotifications.campaignUpdateForSupporter+'`')   ; 
                await db.userNotifications.create({
                    type:'update',
                    userId:supporter.id, 
                    mediaPath:user.mediaPath,
                    content:campaignUpdateMessage
                }) ;
                await sendPushNotification(
                    supporter.id,
                    'keyconservation.org/notifications', 
                    'Key Conservation',
                    removeMd(campaignUpdateMessage)
                );
                resolve() ;
            })
        )
    ) ;
} ;

