"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("admins", {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      login: {
        type: Sequelize.STRING(30),
      },
      password: {
        type: Sequelize.STRING(30),
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1, //0 - главный админ 1 - субАдмин
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(), // Устанавливаем текущую дату
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(), // Устанавливаем текущую дату
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("admins");
  },
};
