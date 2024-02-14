// В файле миграции, например, 20240213120000-add-num-order-to-orders.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Добавляем поле num_order с типом INTEGER в таблицу orders
    await queryInterface.addColumn("orders", "num_order", {
      type: Sequelize.FLOAT,
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Удаляем поле num_order из таблицы orders при откате миграции
    await queryInterface.removeColumn("orders", "num_order");
  },
};
