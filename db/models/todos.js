/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('todos', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    todoList: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'todoLists',
        key: 'id'
      }
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    complete: {
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
    }
  }, {
    tableName: 'todos'
  });
};
