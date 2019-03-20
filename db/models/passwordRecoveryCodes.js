/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('passwordRecoveryCodes', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    expiry: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'passwordRecoveryCodes'
  });
};
