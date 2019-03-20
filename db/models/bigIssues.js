/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bigIssues', {
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
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    displayLocation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mediaPath: {
      type: DataTypes.STRING,
      allowNull: true
    },
    problem: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    whatWeWant: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    whatWeAreDoing: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    howYouCanHelp: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    gotAnIdea: {
      type: DataTypes.TEXT,
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
    tableName: 'bigIssues'
  });
};
