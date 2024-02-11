"use strict";

const { sequelize } = require("../models");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID, // UUID для уникального идентификатора заказа
        defaultValue: Sequelize.UUIDV4, // Значение по умолчанию, генерируемое при создании новой записи
      },
      received_at: {
        type: Sequelize.DATE, // Время, когда заказ был получен
        defaultValue: new Date(), // Устанавливаем текущую дату
      },
      confirmed_at: {
        type: Sequelize.DATE, // Время, когда мастер подтвердил получение заказа
        defaultValue: null,
      },
      departed_at: {
        type: Sequelize.DATE, // Время, когда мастер выехал на место
        defaultValue: null,
      },
      departed_location: {
        type: Sequelize.STRING, // Геопозиция места, откуда мастер выехал
        defaultValue: null,
      },
      started_at: {
        type: Sequelize.DATE, // Время начала работы
        defaultValue: null,
      },
      started_location: {
        type: Sequelize.STRING, // Геопозиция, где начата работа
        defaultValue: null,
      },
      deposit_amount: {
        type: Sequelize.FLOAT, // Сумма задатка
        defaultValue: null,
      },
      deposit_received_at: {
        type: Sequelize.DATE, // Время получения задатка
        defaultValue: null,
      },
      completed_at: {
        type: Sequelize.DATE, // Время завершения заказа
        defaultValue: null,
      },
      completed_location: {
        type: Sequelize.STRING, // Геопозиция места завершения заказа
        defaultValue: null,
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
        type: Sequelize.STRING, // Время встречи с клиентом
      },
      comment: {
        type: Sequelize.TEXT, // Комментарий
        defaultValue: null,
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
          model: "users", // Ссылается на таблицу Users
          key: "id", // Поле, на которое ссылается, в данном случае, id
        },
      },
      amount: {
        type: Sequelize.FLOAT, // Сумма заказа
        defaultValue: null,
      },
      expenses: {
        type: Sequelize.FLOAT, // Расходы
        defaultValue: null,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("orders");
  },
};
