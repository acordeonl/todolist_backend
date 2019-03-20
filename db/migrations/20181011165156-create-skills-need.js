module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'skillNeeds', {
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
                comitmentEstimate: {
                  type: Sequelize.STRING
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
        await queryInterface.dropTable('skillNeeds');
    }
};
