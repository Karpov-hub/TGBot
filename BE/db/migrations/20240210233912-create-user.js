"use strict";

const { sequelize } = require("../models");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      surname: {
        type: Sequelize.STRING(30),
      },
      name: {
        type: Sequelize.STRING(30),
      },
      patronymic: {
        type: Sequelize.STRING(30),
      },
      phone: {
        type: Sequelize.STRING(20),
      },
      passport_photo: {
        type: Sequelize.BLOB("long"), // Assuming you store the passport photo as a BLOB
      },
      status: {
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
