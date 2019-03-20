module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('campaignSupport','paymentId', {type:Sequelize.STRING}) ; 
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('campaignSupport', 'paymentId') ;
    }
};
