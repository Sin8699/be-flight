// const Sequelize = require('sequelize');
const { Sequelize,Op } = require('sequelize');
// const {Sequelize} = Sequelize
const db = require('../db');
const Model = Sequelize.Model;
const User = require('./user');
const Flight = require('./flight');
const configTimestamps = require('../configs/timestamps');

class HistorySale extends Model {
  static createHistorySale = async ({ userID, flightCode, typeSeat, numberSeat, status }) => {
    return await HistorySale.create({
      userID,
      flightCode,
      typeSeat,
      numberSeat,
      status,
    });
  };

  static updateTypeSeatHistorySale = async ({ userID, flightCode, typeSeat }) => {
    return await HistorySale.update(
      {
        typeSeat: typeSeat,
      },
      {
        where: {
          flightCode: flightCode,
          userID: userID,
        },
      }
    );
  };

  static updateStatusHistorySale = async ({ id, status }) => {
    return await HistorySale.update(
      {
        status: status,
      },
      {
        where: {
          id,
        },
      }
    );
  };

  static async getAllSale() {
    return HistorySale.findAll();
  }

  static async getAllSaleByUser(userID) {
    return HistorySale.findAll({
      userID: userID,
    });
  }

  static async getById({ id }) {
    return HistorySale.findOne({
      where: { id },
    });
  }

  static async getAllTotalSeatByFlightCode(flightCode) {
    return HistorySale.findAll({
      where: {
        flightCode,
      },
      raw: true,
      attributes: ['typeSeat', [Sequelize.fn('sum', Sequelize.col('numberSeat')), 'total_seat']],
      group: ['history-sale.typeSeat'],
    });
  }

  static async getHistorySaleByUser(userID) {
    return await HistorySale.findOne({
      raw: true,
      where: { userID: userID },
    });
  }

  static async getHistorySaleByYear(year, userID) {
    return await HistorySale.findAll({
      where: { 
        id : {
          [Op.in]: Sequelize.literal(
            `(SELECT "id" from "history-sales" WHERE EXTRACT(YEAR from"createdAt") = ${year} AND "userID" = ${userID} )`)}
      },
    });
  }

  static async getHistorySaleByStatus(status, userID) {
    if (!userID)
      return await HistorySale.findAll({
        raw: true,
        where: { status: status },
      });
    return await HistorySale.findAll({
      raw: true,
      where: { status: status, userID: userID },
    });
  }
}

HistorySale.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userID: {
      type: Sequelize.INTEGER,
      BelongsTo: User,
      allowNull: false,
    },

    flightCode: {
      type: Sequelize.INTEGER,
      BelongsTo: Flight,
      allowNull: false,
    },

    typeSeat: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    numberSeat: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    status: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },

    ...configTimestamps,
  },
  {
    sequelize: db,
    modelName: 'history-sale',
  }
);
module.exports = HistorySale;
