const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const db = require("./database");
const { sequelize } = require("./user");
const Model = Sequelize.Model;
const User = require("./user");
const Flight = require("./flight");

class HistorySale extends Model {
    static createHistorySale = async ({
    }) => {
        return await HistorySale.create({

        });
    };

    static updateHistorySale = async ({
    }) => {
        return await HistorySale.update({

        });
    };

    static async getAllSale() {
        return HistorySale.findAll();
    };

    static async getHistorySaleByUser(userID) {
        return await HistorySale.findOne({
            where: userID,
          });
    };

}

HistorySale.init(
    {
        userID: {
            type: Sequelize.STRING,
            BelongsTo: User,
            allowNull: false
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
    },
    {
        sequelize: db,
        modelName: "history-sale",
    }
);
module.exports = HistorySale