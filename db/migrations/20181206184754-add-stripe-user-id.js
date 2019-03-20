module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('users','stripeUserId', {type:Sequelize.STRING}) ; 
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('users', 'stripeUserId') ; 
    }
};
