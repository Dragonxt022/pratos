'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Insumo extends Model {
    static associate(models) {
      Insumo.hasMany(models.ItemPrato, {
        foreignKey: 'insumo_id',
        as: 'itensPrato',
      });
      Insumo.hasMany(models.HistoricoPrecoInsumo, {
        foreignKey: 'insumo_id',
        as: 'historico',
        onDelete: 'CASCADE',
        hooks: true,
      });
    }
  }
  Insumo.init(
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
      tipo: {
        type: DataTypes.ENUM('INSUMO', 'EMBALAGEM'),
        allowNull: false,
        defaultValue: 'INSUMO',
      },
      unidade: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Insumo',
      tableName: 'insumos',
      underscored: true,
    }
  );
  return Insumo;
};
