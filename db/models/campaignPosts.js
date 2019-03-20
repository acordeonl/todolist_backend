/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('campaignPosts', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    campaignId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'campaigns',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    mediaPath: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isUpdate: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    isCensored: {
      type: "ARRAY",
      allowNull: true
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    displayLocation: {
      type: "ARRAY",
      allowNull: true
    }
  }, {
    tableName: 'campaignPosts'
  });
};
