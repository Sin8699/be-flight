const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('../db');
const { sequelize } = require('./user');
const Model = Sequelize.Model;
const configTimestamps = require('../configs/timestamps');

class Airport extends Model {
  static async getAllAirport() {
    return Airport.findAll();
  }

  static async getAirportByAirportCode(id) {
    return Airport.findOne({
      where: {
        id: id,
      },
    });
  }

  static createAirport = async ({ name, address }) => {
    return await Airport.create({
      name,
      address,
    });
  };

  static updateAirport = async ({ name, id, address }) => {
    return await Airport.update(
      {
        name: name,
        address: address,
      },
      {
        where: { id: id },
      }
    );
  };
}
Airport.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    address: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    ...configTimestamps,
  },
  {
    sequelize: db,
    modelName: 'airport',
  }
);
module.exports = Airport;
