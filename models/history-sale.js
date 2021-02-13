// const Sequelize = require('sequelize');
const { Sequelize } = require('sequelize');
// const {Sequelize} = Sequelize
const db = require('../db');
const Model = Sequelize.Model;
const User = require('./user');
const Flight = require('./flight');
const configTimestamps = require('../configs/timestamps');

class HistorySale extends Model {
  static createHistorySale = async ({ userID, flightCode, typeSeat, dateSale, status }) => {
    return await HistorySale.create({
      userID,
      flightCode,
      typeSeat,
      dateSale,
      status,
    });
  };

  static updatetypeSeatHistorySale = async ({ userID, flightCode, typeSeat }) => {
    return await HistorySale.update({
      typeSeat: typeSeat,
    },
      {
        where:
        {
          
          flightCode: flightCode,
          userID: userID
        }
      }
    );
  };

  static updateStatusHistorySale = async ({ userID, flightCode, status }) => {
    return await HistorySale.update(
      {
        status: status,
      },
      {
        where: {
          flightCode: flightCode,
          userID: userID,
        },
      }
    );
  };
  
  static async getAllSale() {
    return HistorySale.findAll();
  }

  static async getHistorySaleByUser(userID) {
    return await HistorySale.findOne({
      where: { userID: userID },
    });
  }

  static async getHistorySaleByYear(year) {
    return await HistorySale.findAll();
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
      type: Sequelize.STRING,
      BelongsTo: User,
      allowNull: false,
    },

    flightCode: {
      type: Sequelize.STRING,
      BelongsTo: Flight,
      allowNull: false,
    },

    typeSeat: {
      type: Sequelize.STRING,
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
