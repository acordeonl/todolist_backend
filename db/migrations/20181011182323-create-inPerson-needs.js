module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'inPersonNeeds', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                campaignId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'campaigns',
                        key: 'id'
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade'
                },
                isCompleted: {
                  type: Sequelize.STRING,
                  defaultValue:false
                },
                description: {
                  type: Sequelize.TEXT
                },
                peopleNeeded: {
                  type: Sequelize.STRING
                },
                latitude: {
                  type: Sequelize.DOUBLE
                },
                longitude: {
                  type: Sequelize.DOUBLE
                },
                contactName: {
                  type: Sequelize.STRING
                },
                geoBasedAlertType: {
                  type: Sequelize.STRING
                },
                assistanceTime: {
                  type: Sequelize.STRING
                },
                radius: {
                  type: Sequelize.INTEGER
                },
                createdAt: {
                    type: Sequelize.DATE
                },
                updatedAt: {
                    type: Sequelize.DATE
                }
            }
        );
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('inPersonNeeds');
    }
};
