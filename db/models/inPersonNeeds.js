/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('inPersonNeeds', {
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
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    geoBasedAlertType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    assistanceTime: {
      type: DataTypes.STRING,
      allowNull: true
    },
    radius: {
      type: DataTypes.INTEGER,
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
    peopleNeeded: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    meetingTimeAndDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'inPersonNeeds'
  });
};
