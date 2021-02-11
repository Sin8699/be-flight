const Sequelize = require('sequelize');
const Airport = require('./airport');
const db = require('../db');

const Model = Sequelize.Model;

class Flight extends Model {
  static async getAllFlight() {
    return Flight.findAll();
  }

  static async getAllFlightYetDepart() {
    return Flight.findAll({
      where: {
        dateStart: {
          [Op.gt]: new Date(),
        },
      },
    });
  }

  static async getFlightByFlightCode(flightCode) {
    return Flight.findOne({
      where: {
        flightCode: flightCode,
      },
    });
  }

  static async getFlightByFlightCodeYetDepart(flightCode) {
    return Flight.findOne({
      where: {
        flightCode: flightCode,
        dateStart: {
          [Op.gt]: new Date(),
        },
      },
    });
  }

  static createFlight = async ({
    flightCode,
    airportFrom,
    airportTo,
    dateStart,
    timeStart,
    status,
    vipSeats,
    normalSeats,
    vipPrice,
    normalPrice,
  }) => {
    return await Flight.create({
      flightCode,
      airportFrom,
      airportTo,
      dateStart,
      timeStart,
      status,
      vipSeats,
      normalSeats,
      vipPrice,
      normalPrice,
    });
  };

  static updateFlight = async ({
    flightCode,
    airportFrom,
    airportTo,
    dateStart,
    timeStart,
    status,
    vipSeats,
    normalSeats,
    vipPrice,
    normalPrice,
  }) => {
    return await Flight.update(
      {
        airportFrom: airportFrom,
        airportTo: airportTo,
        dateStart: dateStart,
        timeStart: timeStart,
        status: status,
        vipSeats: vipSeats,
        normalSeats: normalSeats,
        vipPrice: vipPrice,
        normalPrice: normalPrice,
      },
      {
        where: { flightCode: flightCode },
      }
    );
  };
}

Flight.init(
  {
    flightCode: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    airportFrom: {
      type: Sequelize.STRING,
      belongsTo: Airport,

      allowNull: false,
    },

    airportTo: {
      type: Sequelize.STRING,
      belongsTo: Airport,
      allowNull: false,
    },

    dateStart: {
      type: Sequelize.DATE,
      allowNull: false,
    },

    timeStart: {
      type: Sequelize.TIME,
      allowNull: false,
    },

    status: {
      type: Sequelize.STRING,
      defaultValue: 'Ready',
    },

    vipSeats: {
      type: Sequelize.INTEGER,
      defaultValue: 20,
    },

    normalSeats: {
      type: Sequelize.INTEGER,
      defaultValue: 30,
    },

    vipPrice: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },

    normalPrice: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize: db,
    modelName: 'flight',
  }
);

module.exports = Flight;
