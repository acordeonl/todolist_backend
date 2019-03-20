/** 
 * @module helpers/campaignIncludes
 * */
var {db} = require('../db/models');

/**
 * @typedef {Object} Options
 * @property {campaignIncludes} campaignIncludes additional properties for campaign post with sequelize query structure
 */

/**
 * Gets campaign posts structure for sequelize queries
 * @param {number} userId loggued in user's id
 * @param {Options} options used for adding sequelize includes on campaign post structure
 */
module.exports = function getCampaignPostIncludes(userId, options) {
    // basic campaign post structure for sequelize query
    let campaignIncludes = [
        {
            model: db.users,
            attributes: ['id', 'name', 'mediaPath','isOrganization']
        },
        {
            model: db.keys,
            attributes: ['userId'],
            where: {
                userId: userId
            },
            required: false,
            duplicating: false
        }
    ] ;
    // consider additional structure for campaign post
    if(options && options.campaignIncludes)
        campaignIncludes = campaignIncludes.concat(options.campaignIncludes) ;
    let campaignStructure = [{
            model: db.campaigns,
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            include: campaignIncludes,
            required:true,
            duplicating: false
        },
        // used for displaying a post's like for a loggued in user
        {
            model: db.campaignPostLikes,
            attributes: ['id'],
            where: {
                userId: userId
            },
            required: false,
            duplicating: false
        },
        // used for displaying a post's bookmark for a loggued in user
        {
            model: db.campaignPostBookmarks,
            attributes: ['userId'],
            where: {
                userId: userId
            },
            required: false,
            duplicating: false
        }
    ] ;
    // used for displaying campaign posts created by organizations associated with loggued in user's connections
    if(options && options.withConnections)
        campaignStructure[0].include[0].include = [{
            model: db.users,
            attributes:['id'],
            through:{ where:{ connectedUserId:userId } },
            as:'connections',
            required:false,
            duplicating:false
        }] ;
    return campaignStructure ;
};