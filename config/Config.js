const path = require('path');
require('./env');

const dialect = process.env.DB_DIALECT || 'sqlite';

const Config = {
  app: {
    name: process.env.APP_NAME || 'Pratos - Fichas Tecnicas',
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  db: {
    dialect,
    // SQLite
    storage: process.env.DB_STORAGE || path.join(__dirname, '..', 'database.sqlite'),
    // MySQL
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    name: process.env.DB_NAME || '',
    user: process.env.DB_USER || '',
    pass: process.env.DB_PASS || '',
  },
  uploads: {
    dir: process.env.UPLOADS_PATH || path.join(__dirname, '..', 'public', 'uploads', 'pratos'),
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
