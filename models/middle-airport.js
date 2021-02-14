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
      order: [['order', 'ASC']],
    });
  }

  static async findMiddleAirport(where) {
    return MiddleAirport.findOne({
      where: where,
      order: [['order', 'ASC']],
    });
  }

  static createMiddleAirport = async ({ flightCode, airportCode, timeDelay, order }) => {
    return await MiddleAirport.create({
      flightCode,
      airportCode,
      timeDelay,
      order,
    });
  };

  static updateMiddleAirport = async ({ flightCode, airportCode, timeDelay, order, id }) => {
    return await MiddleAirport.update(
      {
        timeDelay: timeDelay,
        order,
        flightCode,
        airportCode,
      },
      {
        where: {
          id: id,
          // and: [{ flightCode: flightCode }, { airportCode: airportCode }],
        },
      }
    );
  };
}

MiddleAirport.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    flightCode: {
      type: Sequelize.INTEGER,
      BelongsTo: Flight,
      allowNull: false,
    },

    airportCode: {
      type: Sequelize.INTEGER,
      BelongsTo: Airport,
      allowNull: false,
    },

    timeDelay: {
      type: Sequelize.TIME,
    },

    order: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    ...configTimestamps,
  },
  {
    sequelize: db,
    modelName: 'middle-airport',
  }
);

module.exports = MiddleAirport;
