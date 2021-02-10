const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('../db');

const Model = Sequelize.Model;

class User extends Model {
  static hashPassword(pass) {
    return bcrypt.hashSync(pass, 10);
  }
  static verifyPassword(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword);
  }
  static async getUser(user) {
    return await User.findOne({
      where: user,
    });
  }
  static async getAllUsers() {
    return await User.findAll();
  }
  static async updatePassword(userId, newPass) {
    return await User.update(
      {
        password: this.hashPassword(newPass),
      },
      {
        where: { id: userId },
      }
    );
  }
  static async updateUser({ userId, email, fullName }) {
    return await User.update(
      {
        email,
        fullName,
      },
      {
        where: { id: userId },
      }
    );
  }
  static async updateForgot({ resetPasswordToken, resetPasswordExpireTime, userId }) {
    return await User.update(
      {
        resetPasswordToken,
        resetPasswordExpireTime,
      },
      {
        where: { id: userId },
      }
    );
  }
  static createUser = async ({ username, password, email, fullName }) => {
    return await User.create({
      username,
      password: this.hashPassword(password),
      email,
      fullName,
    });
  };
}

User.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    fullName: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    password: {
      type: Sequelize.STRING,
      allowNull: false,
      len: [4, 20],
    },

    numberPhone: {
      type: Sequelize.STRING,
      allowNull: false,
      len: [10],
    },

    role: {
      type: Sequelize.STRING,
      allowNull: false,
      enum: ['GUEST', 'ADMIN'],
    },

    accountBalance: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    resetPasswordToken: {
      type: Sequelize.STRING,
      defaultValue: null,
    },

    resetPasswordExpireTime: {
      type: Sequelize.STRING,
      defaultValue: null,
    },
  },
  {
    sequelize: db,
    modelName: 'user',
    timestamps: true,
  }
);

module.exports = User;
