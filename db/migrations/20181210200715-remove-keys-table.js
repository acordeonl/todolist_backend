module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('keys') ; 
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'keys', {
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
                userId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'users',
                        key: 'id'
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade'
                },
                category: {
                  type: Sequelize.STRING
                },
                type: {
                  type: Sequelize.STRING
                },
                createdAt: {
                    type: Sequelize.DATE
                },
                updatedAt: {
                    type: Sequelize.DATE
                }
            }
        );
    }
};
