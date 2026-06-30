'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Prato extends Model {
    static associate(models) {
      Prato.hasMany(models.ItemPrato, {
        foreignKey: 'prato_id',
        as: 'itens',
        onDelete: 'CASCADE',
        hooks: true,
      });
      Prato.hasMany(models.HistoricoPrecoPrato, {
        foreignKey: 'prato_id',
        as: 'historico',
        onDelete: 'CASCADE',
        hooks: true,
      });
    }
  }
  Prato.init(
    {
      codigo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rendimento: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 1,
      },
      preco_venda: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      imagem_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Prato',
      tableName: 'pratos',
      underscored: true,
    }
  );
  return Prato;
};
