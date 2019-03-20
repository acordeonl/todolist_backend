module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('inPersonNeeds', 'peopleNeeded') ;
        await queryInterface.addColumn('inPersonNeeds','peopleNeeded', {type:Sequelize.INTEGER}) ; 
        await queryInterface.addColumn('inPersonNeeds','meetingTimeAndDate', {type:Sequelize.DATE}) ; 
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('inPersonNeeds', 'meetingTimeAndDate') ; 
        await queryInterface.removeColumn('inPersonNeeds', 'peopleNeeded') ; 
        await queryInterface.addColumn('inPersonNeeds','peopleNeeded', {type:Sequelize.STRING}) ;
    }
};
