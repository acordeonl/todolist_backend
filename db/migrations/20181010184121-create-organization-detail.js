module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'organizationDetail', {
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
                phoneNumber: {
                  type: Sequelize.STRING
                },
                website: {
                  type: Sequelize.STRING
                },
                instagram: {
                  type: Sequelize.STRING
                },
                facebook: {
                  type: Sequelize.STRING
                },
                twitter: {
                  type: Sequelize.STRING
                },
                organizationBackground: {
                  type: Sequelize.TEXT
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
        await queryInterface.dropTable('organizationDetail');
    }
};