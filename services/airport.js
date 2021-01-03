const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const db = require("../db");
const { sequelize } = require("./user");
const Model = Sequelize.Model;

class Airport extends Model {

}
Airport.init(
  {
    name:{
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    }, 

    airportCode:{
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    address: {
      type: Sequelize.STRING,
      allowNull: true,
    }

  },
  { 
    sequelize: db,
    modelName: "airport",
  }
);
module.exports = Airport