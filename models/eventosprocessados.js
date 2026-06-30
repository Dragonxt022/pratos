'use strict';
const { Model } = require('sequelize');

// Usado pelos arquivos client/checkEvent.js, confirmaProcesso.js e
// marcaProcessando.js para controlar idempotencia dos eventos recebidos
// do Event Broker.
module.exports = (sequelize, DataTypes) => {
  class EventosProcessados extends Model {
    static associate() {}
  }
  EventosProcessados.init(
    {
      delivery_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      event_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'EventosProcessados',
      tableName: 'eventos_processados',
      underscored: true,
    }
  );
  return EventosProcessados;
};
