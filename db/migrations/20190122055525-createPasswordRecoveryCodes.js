module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'passwordRecoveryCodes', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                email: {
                  type: Sequelize.STRING
                },
                code: {
                  type: Sequelize.INTEGER   
                },
                expiry: {
                  type: Sequelize.DATE
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
        await queryInterface.dropTable('passwordRecoveryCodes');   
    }
};
