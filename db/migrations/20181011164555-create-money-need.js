module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'moneyNeeds', {
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
                description: {
                  type: Sequelize.TEXT
                },
                ammount: {
                  type: Sequelize.DOUBLE
                },
                isCompleted: {
                  type: Sequelize.BOOLEAN,
                  defaultValue:false
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
        await queryInterface.dropTable('moneyNeeds');
    }
};
