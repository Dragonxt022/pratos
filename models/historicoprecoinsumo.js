'use strict';
const { Model } = require('sequelize');

// Snapshot do custo unitario de um insumo (R$ por unidade de medida),
// registrado sempre que o custo dele muda em algum prato que o usa
// (reimportacao de CSV ou edicao manual no Editor). O valor e a media
// ponderada: soma(custo_total dos itens) / soma(quantidade dos itens),
// olhando todos os usos atuais daquele insumo. Alimenta o rastreamento
// de preco por insumo em /analise-precos.
module.exports = (sequelize, DataTypes) => {
  class HistoricoPrecoInsumo extends Model {
    static associate(models) {
      HistoricoPrecoInsumo.belongsTo(models.Insumo, {
        foreignKey: 'insumo_id',
        as: 'insumo',
      });
    }
  }
  HistoricoPrecoInsumo.init(
    {
      insumo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      custo_unitario: {
        type: DataTypes.DECIMAL(12, 4),
        allowNull: false,
        defaultValue: 0,
      },
      custo_total_uso: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'HistoricoPrecoInsumo',
      tableName: 'historico_precos_insumos',
      underscored: true,
    }
  );
  return HistoricoPrecoInsumo;
};
