module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'todos', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                todoList: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'todoLists',
                        key: 'id'
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade'
                },
                value: {
                  type: Sequelize.STRING,
                  defaultValue:''
                },
                complete: {
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
        await queryInterface.dropTable('todos') ;
    }
};
