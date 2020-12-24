const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const db = require("./database");

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
  static async updateUser({
    userId,
    email,
    fullName,
    identity_id,
  }) {
    return await User.update(
      {
        email,
        fullName,
        identity_id,
      },
      {
        where: { id: userId },
      }
    );
  }
  static createUser = async ({
    username,
    password,
    email,
    fullName,
    identity_id,
  }) => {
    return await User.create({
      username,
      password: this.hashPassword(password),
      email,
      fullName,
      identity_id,
    });
  };
}
User.init(
  {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
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
    },
    identity_id: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: "user",
  }
);

module.exports = User;
