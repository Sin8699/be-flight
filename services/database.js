const Sequelize = require("sequelize");

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:1@localhost:5432/Flight";
const db = new Sequelize(connectionString);



module.exports = db;