"use strict";

const { sequelize } = require("../models");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID, // UUID для уникального идентификатора заказа
        defaultValue: Sequelize.UUIDV4, // Значение по умолчанию, генерируемое при создании новой записи
      },
      received_at: {
        type: Sequelize.DATE, // Время, когда заказ был получен
      },
      confirmed_at: {
        type: Sequelize.DATE, // Время, когда клиент подтвердил получение заказа
      },
      departed_at: {
        type: Sequelize.DATE, // Время, когда мастер выехал на место
      },
      departed_location: {
        type: Sequelize.STRING, // Геопозиция места, куда мастер выехал
      },
      started_at: {
        type: Sequelize.DATE, // Время начала работы
      },
      started_location: {
        type: Sequelize.STRING, // Геопозиция, где начата работа
      },
      deposit_amount: {
        type: Sequelize.FLOAT, // Сумма задатка
      },
      deposit_received_at: {
        type: Sequelize.DATE, // Время получения задатка
      },
      completed_at: {
        type: Sequelize.DATE, // Время завершения заказа
      },
      completed_location: {
        type: Sequelize.STRING, // Геопозиция места завершения заказа
      },
      request_date: {
        type: Sequelize.DATE, // Дата обращения клиента
      },
      address: {
        type: Sequelize.STRING, // Адрес выполнения работы
      },
      client_phone: {
        type: Sequelize.STRING, // Номер телефона клиента
      },
      meeting_time: {
        type: Sequelize.TIME, // Время встречи с клиентом
      },
      comment: {
        type: Sequelize.TEXT, // Комментарий
      },
      brand: {
        type: Sequelize.STRING, // Марка техники
      },
      product_type: {
        type: Sequelize.STRING, // Тип техники
      },
      assigned_master: {
        type: Sequelize.UUID, // UUID мастера, на которого назначен заказ
        references: {
          model: "Users", // Ссылается на таблицу Users
          key: "id", // Поле, на которое ссылается, в данном случае, id
        },
      },
      amount: {
        type: Sequelize.FLOAT, // Сумма заказа
      },
      expenses: {
        type: Sequelize.FLOAT, // Расходы
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Orders");
  },
};
