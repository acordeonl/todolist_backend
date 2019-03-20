module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('inPersonNeeds', 'contactName') ; 
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('inPersonNeeds','contactName', {type:Sequelize.STRING});
    }
};
