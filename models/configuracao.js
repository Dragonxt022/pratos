'use strict';
const { Model } = require('sequelize');

// Tabela singleton (sempre 1 linha, id=1) com as preferencias de calculo
// que no prototipo HTML viviam no localStorage do navegador.
module.exports = (sequelize, DataTypes) => {
  class Configuracao extends Model {
    static associate() {}
  }
  Configuracao.init(
    {
      markup: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false,
        defaultValue: 3.5,
      },
      markup_inclui_embalagem: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      cmv_inclui_embalagem: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Configuracao',
      tableName: 'configuracoes',
      underscored: true,
    }
  );
  return Configuracao;
};
