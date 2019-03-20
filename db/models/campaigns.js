/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('campaigns', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    mediaPath: {
      type: DataTypes.STRING,
      allowNull: true
    },
    IUCNStatus: {
      type: "ARRAY",
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    urgencyLevel: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isClosed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    additionalInfo: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'campaigns'
  });
};
