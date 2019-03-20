/** 
 * @module helpers/sendNotification
 * */   
var {db} = require('../db/models');
var fetch = require('node-fetch');

/**
 * Send push notification to user
 * @param {number} userId id for user in database
 * @param {string} title Title for push notification
 * @param {string} content Content for push notification
 */
module.exports = async (userId,url,title,content) =>  {
    // Get user's playerIds
    let playerIds = (await db.pushNotificationPlayerIds.findAll({
        where:{userId}
    })).map(x=>x.playerId) ; 
    if(playerIds.length === 0)
        return ;
    // Send push notifications with one signal to all devices associated with user
    await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            app_id: process.env.oneSignal_appId,
            url,
            headings:{
                en: title,
            },
            contents: {
                en: content
            },
            include_player_ids:playerIds
        })
    });
};