const path = require('path');
require('./env');

const dialect = process.env.DB_DIALECT || 'sqlite';

const mysqlConfig = {
  dialect: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  database: process.env.DB_NAME || '',
  username: process.env.DB_USER || '',
  password: process.env.DB_PASS || '',
};

const sqliteConfig = {
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || path.join(__dirname, '..', 'database.sqlite'),
};

const config = dialect === 'mysql' ? mysqlConfig : sqliteConfig;

module.exports = {
  development: config,
  test: config,
  production: config,
};
