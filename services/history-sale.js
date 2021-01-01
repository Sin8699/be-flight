const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const db = require("./database");
const { sequelize } = require("./user");
const Model = Sequelize.Model;
const User = require("./user");
const Flight = require("./flight");

class HistorySale extends Model {

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