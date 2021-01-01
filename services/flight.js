const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const Airport = require("./airport")
const db = require("./database");

const Model = Sequelize.Model;

class Flight extends Model {

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

        dateStar: {
            type: Sequelize.DATE,
            allowNull: false
        },

        timeStar: {
            type: Sequelize.TIME,
            allowNull: false
        },

        status: {
            type: Sequelize.STRING,
            defaultValue : "Ready",
        },

        vipSeats: {
            type: Sequelize.INTEGER,
            defaultValue : 20,
        },

        normalSeats: {
            type: Sequelize.INTEGER,
            defaultValue : 30,
        },

        vipPrice:{
            type: Sequelize.INTEGER,
            defaultValue : 0,
        },

        normalPrice:{
            type: Sequelize.INTEGER,
            defaultValue : 0,
        },
    },
    {
        sequelize: db,
        modelName: "flight",
    }
);
// Airport.hasMany(Flight);
// Flight.belongsTo(Airport);


module.exports = Flight;
