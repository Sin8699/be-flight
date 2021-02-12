const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('../db');
const Flight = require('./flight');
const Airport = require('./airport');
const Model = Sequelize.Model;
const configTimestamps = require('../configs/timestamps');

class MiddleAirport extends Model {
  static async getAllMiddleAirport() {
    return MiddleAirport.findAll();
  }

  static async getMiddleAirportByFlightCode(flightCode) {
    return MiddleAirport.findAll({
      where: {
        flightCode: flightCode,
      },
    });
  }

  static createMiddleAirport = async ({ flightCode, airportCode, timeDelay }) => {
    return await MiddleAirport.create({
      flightCode,
      airportCode,
      timeDelay,
    });
  };

  static updateMiddleAirport = async ({ flightCode, airportCode, timeDelay }) => {
    return await MiddleAirport.update(
      {
        timeDelay: timeDelay,
      },
      {
        where: {
          and: [{ flightCode: flightCode }, { airportCode: airportCode }],
        },
      }
    );
  };
}

MiddleAirport.init(
  {
    flightCode: {
      type: Sequelize.STRING,
      BelongsTo: Flight,
      allowNull: false,
    },

    airportCode: {
      type: Sequelize.STRING,
      BelongsTo: Airport,
      allowNull: false,
    },

    timeDelay: {
      type: Sequelize.TIME,
    },

    ...configTimestamps,
  },
  {
    sequelize: db,
    modelName: 'middle-airport',
  }
);

module.exports = MiddleAirport;
