module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('campaigns','additionalInfo', {type:Sequelize.STRING}); 
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('campaigns', 'additionalInfo');
    }
};
