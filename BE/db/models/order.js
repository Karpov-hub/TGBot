"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    static associate(models) {}
  }
  order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      received_at: DataTypes.DATE, // Время, когда заказ был получен
      confirmed_at: DataTypes.DATE, // Время, когда мастер подтвердил получение заказа
      departed_at: DataTypes.DATE, // Время, когда мастер выехал на место
      departed_location: DataTypes.STRING, // Геопозиция места, откуда мастер выехал
      started_at: DataTypes.DATE, // Время начала работы
      started_location: DataTypes.STRING, // Геопозиция, где начата работа
      deposit_amount: DataTypes.FLOAT, // Сумма задатка
      deposit_received_at: DataTypes.DATE, // Время получения задатка
      completed_at: DataTypes.DATE, // Время завершения заказа
      completed_location: DataTypes.STRING, // Геопозиция места завершения заказа
      address: DataTypes.STRING, // Адрес выполнения работы
      client_phone: DataTypes.STRING, // Номер телефона клиента
      meeting_time: DataTypes.STRING, // Время встречи с клиентом
      comment: DataTypes.TEXT, // Комментарий
      brand: DataTypes.STRING, // Марка техники
      product_type: DataTypes.STRING, // Тип техники
      assigned_master: DataTypes.UUID, // UUID мастера, на которого назначен заказ
      amount: DataTypes.FLOAT, // Сумма заказа
      expenses: DataTypes.FLOAT, // Расходы
      photo_urls: DataTypes.ARRAY(DataTypes.STRING), // фото
      breakage_type: DataTypes.STRING, // Тип поломки
      num_order: DataTypes.FLOAT, // Тип поломки
    },
    {
      sequelize,
      createdAt: false,
      updatedAt: false,
      modelName: "order",
    }
  );
  return order;
};
