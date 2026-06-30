'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ItemPrato extends Model {
    static associate(models) {
      ItemPrato.belongsTo(models.Prato, {
        foreignKey: 'prato_id',
        as: 'prato',
      });
      ItemPrato.belongsTo(models.Insumo, {
        foreignKey: 'insumo_id',
        as: 'insumo',
      });
    }
  }
  ItemPrato.init(
    {
      prato_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      insumo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantidade: {
        type: DataTypes.DECIMAL(10, 3),
        allowNull: false,
        defaultValue: 0,
      },
      custo_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'ItemPrato',
      tableName: 'itens_prato',
      underscored: true,
    }
  );
  return ItemPrato;
};
