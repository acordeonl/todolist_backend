module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('campaignPosts', 'displayLocation') ; 
        await queryInterface.addColumn('campaignPosts','displayLocation', {type:Sequelize.ARRAY(Sequelize.STRING)}) ; 
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('campaignPosts', 'displayLocation') ;
        await queryInterface.addColumn('campaignPosts','displayLocation', {type:Sequelize.STRING}) ; 
    }
};
