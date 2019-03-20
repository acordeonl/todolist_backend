module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'campaigns', {
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
                mediaPath: {
                  type: Sequelize.STRING
                },
                IUCNStatus: {
                  type: Sequelize.ARRAY(Sequelize.STRING)
                },
                name: {
                  type: Sequelize.STRING
                },
                urgencyLevel: {
                  type: Sequelize.STRING
                },
                isClosed: {
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
        await queryInterface.dropTable('campaigns');
    }
};
