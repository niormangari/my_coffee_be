"use strict";

const { User: UserModel } = require("../models");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const dataByEmail = await UserModel.findOne({
      where: {
        email: "gmail@gmail.com",
      },
    });
    if (dataByEmail) {
      return console.log(`user with email: gmail@gmail.com allready exist`);
    }

    return await UserModel.create({
      id: uuidv4(),
      email: "gmail@gmail.com",
      fullname: "junior",
      password: await bcrypt.hash("admin", 10),
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
