require('./env');

// Config central da aplicacao. Nenhum modulo deve ler process.env
// diretamente fora deste arquivo (e de config/config.js, usado so pelo
// sequelize-cli) - assim toda variavel sensivel fica centralizada e
// vinda do .env.
const Config = {
  app: {
    name: process.env.APP_NAME || 'Pratos - Fichas Tecnicas',
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    dialect: process.env.DB_DIALECT || 'mysql',
  },
  integrations: {
    eventBroker: {
      url: process.env.EVENT_BROKER_URL || '',
      serviceToken: process.env.EVENT_BROKER_SERVICE_TOKEN || '',
    },
  },
  defaults: {
    markup: parseFloat(process.env.DEFAULT_MARKUP || '3.5'),
  },
};

module.exports = Config;
