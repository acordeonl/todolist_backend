module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'groupEvents', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                groupId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'groups',
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
                date: {
                  type: Sequelize.DATE
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
        await queryInterface.dropTable('groupEvents');
    }
};
