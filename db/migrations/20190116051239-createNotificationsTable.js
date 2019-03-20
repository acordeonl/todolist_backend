module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'userNotifications', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
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
                content: {
                  type: Sequelize.STRING
                },
                mediaPath: {
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
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('userNotifications');
    }
};
