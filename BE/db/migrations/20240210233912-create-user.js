"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      chat_id: {
        type: Sequelize.STRING(70),
      },
      surname: {
        type: Sequelize.STRING(30),
        defaultValue: null,
      },
      name: {
        type: Sequelize.STRING(30),
        defaultValue: null,
      },
      patronymic: {
        type: Sequelize.STRING(30),
        defaultValue: null,
      },
      phone: {
        type: Sequelize.STRING(20),
        defaultValue: null,
      },
      passport_photo: {
        type: Sequelize.BLOB, // Assuming you store the passport photo as a BLOB
        defaultValue: null,
      },
      status: {
        type: Sequelize.INTEGER, //Свободен, Занят, Не получает
        defaultValue: 0,
      },
      status_sys: {
        type: Sequelize.INTEGER, //Не block or unblock
        defaultValue: 0,
      },
      roll: {
        type: Sequelize.INTEGER, //Мастер, Админ, Инструктор и тп на будующее...
        defaultValue: 0,
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
    await queryInterface.dropTable("users");
  },
};
