module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'todoLists', {
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
                  type: Sequelize.STRING,
                  defaultValue:'Untitled todo list'
                },
                tags: {
                  type: Sequelize.STRING,
                  defaultValue:''
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
        await queryInterface.dropTable('todoLists');
    }
};
