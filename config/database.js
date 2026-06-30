require('./env');

// Config exclusivo do sequelize-cli (migrations/seeds). A aplicacao em si
// usa config/Config.js - este arquivo existe so porque o sequelize-cli
// espera um config/<algo>.js|json no formato abaixo (apontado pelo
// .sequelizerc).
function envConfig() {
  return {
    username: process.env.DB_USER,
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
  };
}

module.exports = {
  development: envConfig(),
  test: envConfig(),
  production: envConfig(),
};
