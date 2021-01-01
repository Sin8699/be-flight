const Sequelize = require("sequelize");

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:tuananh1@localhost:5433/Flight";
const db = new Sequelize(connectionString);



module.exports = db;