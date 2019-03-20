module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'bigIssues', {
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
                title: {
                  type: Sequelize.STRING
                },
                displayLocation: {
                  type: Sequelize.STRING
                },
                mediaPath: {
                  type: Sequelize.STRING
                },
                problem: {
                  type: Sequelize.TEXT
                },
                whatWeWant: {
                  type: Sequelize.TEXT
                },
                whatWeAreDoing: {
                  type: Sequelize.TEXT
                },
                howYouCanHelp: {
                  type: Sequelize.TEXT
                },
                gotAnIdea: {
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
        await queryInterface.dropTable('bigIssues');
    }
};
