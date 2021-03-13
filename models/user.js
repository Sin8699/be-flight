const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('../db');
const config = require('../configs');
const Model = Sequelize.Model;
const { ROLE, ROLE_USER } = require('../constant');
const configTimestamps = require('../configs/timestamps');

class User extends Model {
  static hashPassword(pass) {
    return bcrypt.hashSync(pass, config.saltRounds);
  }
  static verifyPassword(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword);
  }
  static async getUser(user) {
    return await User.findOne({
      where: user,
    });
  }
  static async getAllUsersGuest() {
    return await User.findAll({
      raw: true,
      where: {
        role: ROLE_USER.GUEST,
      },
    });
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

  static async updateUser(userId, { email, fullName, ...rest }) {
    return await User.update(
      {
        email,
        fullName,
        ...rest,
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

  static async findUserByQuery(where) {
    return await User.findAll({
      where,
    });
  }

  static createUser = async ({ username, password, email, fullName, role, accountBalance, numberPhone }) => {
    return await User.create({
      username,
      password: this.hashPassword(password),
      email,
      fullName,
      numberPhone,
      accountBalance,
      role,
    });
  };

  static async updateMoney(id, accountBalance) {
    return await User.update(
      {
        accountBalance,
      },
      {
        where: {
          id,
        },
      }
    );
  }
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
      enum: ROLE,
      defaultValue: ROLE_USER.GUEST,
    },

    accountBalance: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },

    resetPasswordToken: {
      type: Sequelize.STRING,
      defaultValue: null,
    },

    resetPasswordExpireTime: {
      type: Sequelize.DATE,
      defaultValue: null,
    },

    ...configTimestamps,
  },
  {
    sequelize: db,
    modelName: 'user',
  }
);

module.exports = User;
