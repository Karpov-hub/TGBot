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
      chat_id: DataTypes.STRING(70),
      surname: DataTypes.STRING(30),
      name: DataTypes.STRING(30),
      patronymic: DataTypes.STRING(30),
      phone: DataTypes.STRING(20),
      passport_photo: DataTypes.BLOB, // Assuming you store the passport photo as a BLOB
      status: DataTypes.INTEGER,
      status_sys: DataTypes.INTEGER,
      roll: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      createdAt: true,
      updatedAt: true,
      modelName: "user",
    }
  );
  return user;
};
