module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'campaignSupport', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                campaignPostId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'campaignPosts',
                        key: 'id'
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade'
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
                  allowNull: true,
                  references: {
                    model: 'users',
                    key: 'id'
                  },
                  onUpdate: 'cascade',
                  onDelete: 'cascade'
                },
                supportType: {
                  type: Sequelize.STRING
                },
                moneyNeedId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'moneyNeeds',
                        key: 'id'
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade'
                },
                moneyAmmount: {
                  type: Sequelize.DOUBLE
                },
                skillNeedId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'skillNeeds',
                        key: 'id'
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade'
                },
                inPersonNeedId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'inPersonNeeds',
                        key: 'id'
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade'
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
        await queryInterface.dropTable('campaignSupport');
    }
};
