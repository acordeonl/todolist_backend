module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'groups', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                adminUserId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'users',
                        key: 'id'
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade'
                },
                name: {
                  type: Sequelize.STRING
                },
                description: {
                  type: Sequelize.TEXT
                },
                aboutUs: {
                  type: Sequelize.TEXT
                },
                mediaPath: {
                  type: Sequelize.STRING
                },
                displayLocation: {
                  type: Sequelize.STRING
                },
                latitude: {
                  type: Sequelize.DOUBLE
                },
                longitude: {
                  type: Sequelize.DOUBLE
                },
                isPrivate: {
                  type: Sequelize.BOOLEAN
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
        await queryInterface.dropTable('groups');
    }
};
