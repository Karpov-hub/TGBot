"use strict";

const { sequelize } = require("../models");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      email: {
        type: Sequelize.STRING(40)
      },
      password: {
        type: Sequelize.STRING(50)
      },
      surname: {
        type: Sequelize.STRING(30)
      },
      name: {
        type: Sequelize.STRING(30)
      },
      patronymic: {
        type: Sequelize.STRING(30)
      },
      phone: {
        type: Sequelize.STRING(20)
      },
      roll: {
        type: Sequelize.INTEGER
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
