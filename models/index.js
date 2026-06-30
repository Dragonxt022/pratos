'use strict';

require('../config/env');

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const Config = require('../config/Config');
const db = {};

let sequelize;

if (Config.db.dialect === 'mysql') {
  sequelize = new Sequelize(Config.db.name, Config.db.user, Config.db.pass, {
    host: Config.db.host,
    port: Config.db.port,
    dialect: 'mysql',
    logging: false,
  });
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: Config.db.storage,
    logging: false,
  });
}

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
