const Sequelize = require('sequelize');
const Airport = require('./airport');
const db = require('../db');
const configTimestamps = require('../configs/timestamps');
const Model = Sequelize.Model;
const Op = Sequelize.Op;

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
        dateStart: {
          [Op.gt]: new Date(),
        },
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
    dateEnd,
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
      dateEnd,
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
    dateEnd,
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
        dateEnd: dateEnd,
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

    dateEnd: {
      type: Sequelize.DATE,
      allowNull: false,
      // validate: { min: '00:30' },
      // defaultValue: '00:30',
    },

    // status: {
    //   type: Sequelize.STRING,
    //   defaultValue: 'Ready',
    // },

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

    ...configTimestamps,
  },
  {
    sequelize: db,
    modelName: 'flight',
  }
);

module.exports = Flight;
