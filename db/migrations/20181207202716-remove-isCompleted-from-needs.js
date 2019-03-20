module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('moneyNeeds', 'isCompleted') ;  
        await queryInterface.removeColumn('inPersonNeeds', 'isCompleted') ;  
        await queryInterface.removeColumn('skillNeeds', 'isCompleted') ;  
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('moneyNeeds','isCompleted', {type:Sequelize.Boolean,allowNull:true,defaultValue:false}) ; 
        await queryInterface.addColumn('inPersonNeeds','isCompleted', {type:Sequelize.Boolean,allowNull:true,defaultValue:false}) ; 
        await queryInterface.addColumn('skillNeeds','isCompleted', {type:Sequelize.Boolean,allowNull:true,defaultValue:false}) ; 
    }
};
