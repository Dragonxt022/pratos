'use strict';
const { Model } = require('sequelize');

// Configuracao de uma integracao com uma API externa para sincronizar
// insumos/embalagens automaticamente. Como a API externa nao informa se um
// item e INSUMO ou EMBALAGEM, cada integracao tem um tipo_padrao fixo - para
// sincronizar os dois tipos, criam-se duas integracoes (uma URL por tipo).
module.exports = (sequelize, DataTypes) => {
  class IntegracaoApi extends Model {}
  IntegracaoApi.init(
    {
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      metodo: {
        type: DataTypes.ENUM('GET', 'POST'),
        allowNull: false,
        defaultValue: 'GET',
      },
      tipo_padrao: {
        type: DataTypes.ENUM('INSUMO', 'EMBALAGEM'),
        allowNull: false,
        defaultValue: 'INSUMO',
      },
      mapeamento: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      auth_header: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      intervalo_minutos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 360,
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ultima_sincronizacao: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      ultimo_status: {
        type: DataTypes.ENUM('sucesso', 'erro'),
        allowNull: true,
      },
      ultimo_resultado: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'IntegracaoApi',
      tableName: 'integracoes_api',
      underscored: true,
    }
  );
  return IntegracaoApi;
};
