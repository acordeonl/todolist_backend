module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('campaignSupport', 'campaignPostId');
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('campaignSupport', 'campaignPostId', {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'campaignPosts',
                key: 'id'
            },
            onUpdate: 'cascade',
            onDelete: 'cascade'
        });
    }
};