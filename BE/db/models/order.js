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
      received_at: DataTypes.DATE,
      confirmed_at: DataTypes.DATE,
      departed_at: DataTypes.DATE,
      departed_location: DataTypes.STRING,
      started_at: DataTypes.DATE,
      started_location: DataTypes.STRING,
      deposit_amount: DataTypes.FLOAT,
      deposit_received_at: DataTypes.DATE,
      completed_at: DataTypes.DATE,
      completed_location: DataTypes.STRING,
      request_date: DataTypes.DATE,
      address: DataTypes.STRING,
      client_phone: DataTypes.STRING,
      meeting_time: DataTypes.TIME,
      comment: DataTypes.TEXT,
      brand: DataTypes.STRING,
      product_type: DataTypes.STRING,
      assigned_master: DataTypes.UUID,
      amount: DataTypes.FLOAT,
      expenses: DataTypes.FLOAT,
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
