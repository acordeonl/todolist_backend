module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('campaignPostComments','content', {type:Sequelize.TEXT});
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('campaignPostComments', 'content');
    }
};
