const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const db = require("../db");
const Flight = require("./flight");
const Airport = require("./airport");

const Model = Sequelize.Model;

class MiddleAirport extends Model {

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
            type: Sequelize.TIME
        },
    },
    {
        sequelize: db,
        modelName: "middle-airport",
    },
);

module.exports = MiddleAirport;