"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class admin extends Model {
    static associate(models) {}
  }
  admin.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      login: DataTypes.STRING(30),
      password: DataTypes.STRING(30),
      status: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      createdAt: true,
      updatedAt: true,
      modelName: "admin",
    }
  );
  return admin;
};
