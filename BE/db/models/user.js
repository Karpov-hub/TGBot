"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {}
  }
  user.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      surname: DataTypes.STRING(30),
      name: DataTypes.STRING(30),
      patronymic: DataTypes.STRING(30),
      phone: DataTypes.STRING(20),
      passport_photo: DataTypes.BLOB("long"), // Предполагается, что фото паспорта хранится в виде BLOB
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      createdAt: false,
      updatedAt: false,
      modelName: "user",
    }
  );
  return user;
};
