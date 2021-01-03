const Sequelize = require("sequelize");

const configConnectionDB = {
  database: process.env.DATABASE,
  username: process.env.USERNAME_DB,
  password: process.env.PASSWORD_DB,
  host: process.env.HOST_DB,
  port: 5432,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

const db = new Sequelize(configConnectionDB);

module.exports = db;
