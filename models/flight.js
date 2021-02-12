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

  static async getFlightByFlightCode(id) {
    return Flight.findOne({
      where: {
        id,
      },
    });
  }

  static async getFlightByFlightCodeYetDepart(id) {
    return Flight.findOne({
      where: {
        id,
        dateStart: {
          [Op.gt]: new Date(),
        },
      },
    });
  }

  static createFlight = async ({
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
        where: { id: flightCode },
      }
    );
  };
}

Flight.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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

    goingTime: {
      type: Sequelize.TIME,
      allowNull: false,
      defaultValue: '00:30',
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
