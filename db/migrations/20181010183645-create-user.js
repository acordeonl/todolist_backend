module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'users', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                username: {
                  type: Sequelize.STRING
                },
                email: {
                  type: Sequelize.STRING
                },
                password: {
                  type: Sequelize.STRING
                },
                language: {
                  type: Sequelize.STRING,
                  defaultValue:'en'
                },
                name: {
                  type: Sequelize.STRING
                },
                description: {
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
                isOrganization: {
                  type: Sequelize.BOOLEAN,
                  defaultValue:false
                },
                parentOrganizationId: {
                  type: Sequelize.INTEGER
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
        await queryInterface.dropTable('users');
    }
};
