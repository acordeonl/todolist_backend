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
    // --------------- TodoList ----------------------
      db.users.hasMany(db.todoLists) ;
      db.todoLists.hasMany(db.todos) ;
        // db.campaigns.belongsTo(db.users) ; 
        // db.campaigns.hasMany(db.campaignSupport) ;
        // db.campaigns.hasMany(db.keys) ;
        // db.campaigns.hasMany(db.campaignPosts);
        // db.campaigns.hasMany(db.moneyNeeds);
        // db.campaigns.hasMany(db.inPersonNeeds);
        // db.campaigns.hasMany(db.skillNeeds);
        // db.campaigns.hasMany(db.tags);
        

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