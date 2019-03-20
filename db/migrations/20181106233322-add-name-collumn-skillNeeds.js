module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('skillNeeds','name', {type:Sequelize.STRING});
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('skillNeeds', 'name');
    }
};
