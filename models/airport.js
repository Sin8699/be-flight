const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('../db');
const { sequelize } = require('./user');
const Model = Sequelize.Model;
const configTimestamps = require('../configs/timestamps');

class Airport extends Model {
  static async getAllAirport() {
    return Airport.findAll();
  }

  static async getAirportByAirportCode(airportCode) {
    return Airport.findOne({
      where: {
        airportCode: airportCode,
      },
    });
  }

  static createAirport = async ({ name, airportCode, address }) => {
    return await Airport.create({
      name,
      airportCode,
      address,
    });
  };

  static updateAirport = async ({ name, airportCode, address }) => {
    return await Airport.update(
      {
        name: name,
        airportCode: airportCode,
        address: address,
      },
      {
        where: { airportCode: airportCode },
      }
    );
  };
}
Airport.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    airportCode: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    address: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    ...configTimestamps,
  },
  {
    sequelize: db,
    modelName: 'airport',
  }
);
module.exports = Airport;
