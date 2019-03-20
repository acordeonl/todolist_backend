/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('campaignSupport', {
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    supportType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    moneyNeedId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'moneyNeeds',
        key: 'id'
      }
    },
    moneyAmmount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    skillNeedId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'skillNeeds',
        key: 'id'
      }
    },
    inPersonNeedId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'inPersonNeeds',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'campaignSupport'
  });
};
