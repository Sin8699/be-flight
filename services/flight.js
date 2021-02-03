const Sequelize = require("sequelize");
const Airport = require("./airport")
const db = require("./database");
const Model = Sequelize.Model;

class Flight extends Model {

    static async getAllFlight() {
        return Flight.findAll();
    };

    static async getFlightByFlightCode(flightCode) {
        return Flight.findOne({
            where: {
                flightCode: flightCode,
            }
        })
    };

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
            allowNull: false
        },

        timeStart: {
            type: Sequelize.TIME,
            allowNull: false
        },

        status: {
            type: Sequelize.STRING,
            defaultValue: "Ready",
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
        modelName: "flight",
    }
);



module.exports = Flight;
