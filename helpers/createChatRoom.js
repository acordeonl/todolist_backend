/** 
 * @module helpers/createChatRoom
 * */
var {db} = require('../db/models');

const Chatkit = require('@pusher/chatkit-server');
const chatkit = new Chatkit.default({
    instanceLocator: process.env.chatkit_instance_prefix + ':' + process.env.chatkit_instance,
    key: process.env.chatkit_secret_key_id + ':' + process.env.chatkit_secret_key
});

/**
 * @typedef {Object} campaignSupport
 * @property {number} campaignId campaign's database id
 * @property {number} inPersonNeedId inPersonNeed database id
 * @property {number} skillNeedId skillNeed database id
 */

/**
 * Creates chatkit room for given users
 * @param {number} userId_1 userId of first user associated to new chat room
 * @param {number} userId_2 userId of second user associated to new chat room
 * @param {string} type Type of chatRoom. Values: { Direct , Campaigns}
 * @param {campaignSupport} campaignSupport Data associated with Campaign type chat rooms
 */
module.exports = async (userId_1,userId_2,type,campaignSupport) =>  {
    // get playerIds associated to both users
    let playerIds = {} ; 
    playerIds[`User${userId_1}`] = (await db.pushNotificationPlayerIds.findAll({
        where:{userId:userId_1}
    })).map(x=>x.playerId) ; 
    playerIds[`User${userId_2}`] = (await db.pushNotificationPlayerIds.findAll({
        where:{userId:userId_2
    }})).map(x=>x.playerId) ; 
    // create rooms with playerIds for sending push notifications with oneSignal
    return await chatkit.createRoom({
        creatorId:`User${userId_1}`,
        name: `User${userId_1} - User${userId_2}`,
        userIds: [`User${userId_1}`, `User${userId_2}`],
        customData:{ 
            type,
            campaignSupport,
            playerIds,
            unreadMessages:false,
            timestamp:null
        },
        isPrivate: true
    });
};