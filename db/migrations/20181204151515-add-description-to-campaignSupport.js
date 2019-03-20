module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('campaignSupport','description', {type:Sequelize.TEXT}) ;
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('campaignSupport', 'description') ;
    }
};
