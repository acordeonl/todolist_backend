'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/database.js')[env];
const db = {};


let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

// validations
// db.posts.hook('afterValidate', (post, options) => {
//     if (post.title.length > 5)
//         return sequelize.Promise.reject(new Error("validation failed men"));
// });

// db.usuarios.addScope('test', {
//     include: [
//         { model: db.posts , where: { title:'test2' } }
//     ]
// }) ; 

// --------------- Associations ----------------------          
    // --------------- Campaigns ----------------------
        db.campaigns.belongsTo(db.users) ; 
        db.campaigns.hasMany(db.campaignSupport) ;
        db.campaigns.hasMany(db.keys) ;
        db.campaigns.hasMany(db.campaignPosts);
        db.campaigns.hasMany(db.moneyNeeds);
        db.campaigns.hasMany(db.inPersonNeeds);
        db.campaigns.hasMany(db.skillNeeds);
        db.campaigns.hasMany(db.tags);
    
    // --------------- CampaignPosts ----------------------
        db.campaignPosts.belongsTo(db.campaigns) ; 
        db.campaignPosts.hasOne(db.campaignPostLikes) ;
        db.campaignPosts.hasOne(db.campaignPostBookmarks) ;
        db.campaignPosts.hasMany(db.campaignPostComments) ;
        db.campaignPostComments.belongsTo(db.users) ; 
        db.campaignPostBookmarks.belongsTo(db.campaignPosts) ; 
    
    // --------------- Users ----------------------
        db.users.hasMany(db.campaignPostBookmarks) ;
        db.users.hasMany(db.campaignSupport) ;   
        db.users.hasOne(db.organizationDetail) ; 
        db.users.hasMany(db.bigIssues) ; 
        db.users.hasMany(db.pushNotificationPlayerIds) ;
    // --------------- CampaignSupport ----------------------
        db.campaignSupport.belongsTo(db.moneyNeeds) ; 
        db.campaignSupport.belongsTo(db.skillNeeds) ; 
        db.campaignSupport.belongsTo(db.inPersonNeeds) ; 
        db.campaignSupport.belongsTo(db.users) ; 
        db.campaignSupport.belongsTo(db.campaigns) ;
        db.campaignSupport.belongsTo(db.users) ; 
    
    // --------------- Keys ----------------------
        db.keys.belongsTo(db.users) ; 
        db.keys.belongsTo(db.campaigns) ;

    // --------------- Needs ----------------------
        db.inPersonNeeds.belongsTo(db.campaigns) ;
        db.skillNeeds.belongsTo(db.campaigns) ;
        db.moneyNeeds.hasMany(db.campaignSupport) ; 
        db.skillNeeds.hasMany(db.campaignSupport) ; 
        db.inPersonNeeds.hasMany(db.campaignSupport) ; 

    // --------------- Groups ----------------------
        db.groupMembers.belongsTo(db.users) ;
        db.groupPostComments.belongsTo(db.users) ;
        db.groupEventGoings.belongsTo(db.users) ;
        db.groupEventInteresteds.belongsTo(db.users) ;
        db.groupPosts.belongsTo(db.users) ;
        db.groupPosts.hasOne(db.groupPostLikes) ;

        

    db.tags.belongsTo(db.users) ; 
    db.skilledImpact.belongsTo(db.users) ; 


db.userConnections.belongsTo(db.users, {foreignKey: 'connectorUserId'}) ;
db.users.belongsToMany(db.users, 
    {
        as: 'connections',
        through: db.userConnections,
        foreignKey: 'connectorUserId',
        otherKey: 'connectedUserId'
    });

sequelize.modelManager.models.forEach(model => {
    Object.getOwnPropertyNames(model.attributes).forEach(attributeName => {
        if (model.attributes[attributeName].references) {
            // console.log('-----------')
            // console.log(attributeName + "->" +
            //     model.attributes[attributeName].references.model + "." +
            //     model.attributes[attributeName].references.key);

            var refModel = sequelize.models[model.attributes[attributeName].references.model];
            // refModel.hasMany(model);
            // console.log(refModel.name , '->', model.name );
            // model.belongsTo(refModel) ;
            // model.belongsTo(refModel, {
            //     foreignKey: attributeName,
            //     as: attributeName.split('Id')[0]
            // });

            // console.log('mapping as: ' + attributeName.split('Id')[0] + ' on ' + attributeName)
            // console.log('-----------')
        }
    });
});



Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports.db = db;