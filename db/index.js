const Sequelize = require('sequelize');

const configConnectionDB = {
  database: process.env.DATABASE_NAME || 'Flight',
  username: process.env.USERNAME_DB || 'postgres',
  password: process.env.PASSWORD_DB || 1,
  host: process.env.HOST_DB || 'localhost',
  port: 5432,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

// const connectionString = process.env.DATABASE_URL || 'postgres://postgres:1@localhost:5432/Flight';

const db = new Sequelize(configConnectionDB);

module.exports = db;
