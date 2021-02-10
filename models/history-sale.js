const Sequelize = require("sequelize");
const db = require("../db");
const Model = Sequelize.Model;
const User = require('./user');
const Flight = require('./flight');

class HistorySale extends Model {
    static createHistorySale = async ({
        userID,
        flightCode,
        typeSeat,
        dateSale,
        status
    }) => {
        return await HistorySale.create({
            userID,
            flightCode,
            typeSeat,
            dateSale,
            status
        });
    };

    static updateHistorySale = async ({
    }) => {
        return await HistorySale.update({

        },
            {
                where: {}
            });
    };

    static async getAllSale() {
        return HistorySale.findAll();
    };

    static async getHistorySaleByUser(userID) {
        return await HistorySale.findOne({
            where: { userID: userID },
        });
    };

    static async getHistorySaleByYear(year) {
        return await HistorySale.findAll({ 
           
        });
    };

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

        dateSale: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        status: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        }
    },
  },
  {
    sequelize: db,
    modelName: 'history-sale',
  }
);
module.exports = HistorySale;
