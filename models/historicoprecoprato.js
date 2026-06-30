'use strict';
const { Model } = require('sequelize');

// Cada linha e uma "versao" (snapshot) do calculo de um prato, registrada
// sempre que o custo dos itens muda (reimportacao de CSV ou edicao manual
// no Editor). Usado para o grafico de tendencia no dashboard e para a
// pagina de analise de progresso de preco (/analise-precos).
module.exports = (sequelize, DataTypes) => {
  class HistoricoPrecoPrato extends Model {
    static associate(models) {
      HistoricoPrecoPrato.belongsTo(models.Prato, {
        foreignKey: 'prato_id',
        as: 'prato',
      });
    }
  }
  HistoricoPrecoPrato.init(
    {
      prato_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      custo_insumos: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      custo_embalagem: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      custo_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      preco_sugerido: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      cmv: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'HistoricoPrecoPrato',
      tableName: 'historico_precos_pratos',
      underscored: true,
    }
  );
  return HistoricoPrecoPrato;
};
