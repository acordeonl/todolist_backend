module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'campaignPosts', {
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
                mediaPath: {
                  type: Sequelize.STRING
                },
                isUpdate: {
                  type: Sequelize.BOOLEAN,
                  defaultValue:false
                },
                isCensored: {
                  type: Sequelize.ARRAY(Sequelize.STRING)
                },
                latitude: {
                  type: Sequelize.DOUBLE
                },
                longitude: {
                  type: Sequelize.DOUBLE
                },
                displayLocation: {
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
    down: async  (queryInterface, Sequelize) => {
        await queryInterface.dropTable('campaignPosts');
    }
};
