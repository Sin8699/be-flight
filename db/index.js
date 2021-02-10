const Sequelize = require('sequelize');

const configConnectionDB = {
  database: process.env.DATABASE_NAME,
  username: process.env.USERNAME_DB,
  password: process.env.PASSWORD_DB,
  host: process.env.HOST_DB,
  port: 5432,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:1@localhost:5432/Flight';

const db = new Sequelize(configConnectionDB || connectionString);

module.exports = db;
