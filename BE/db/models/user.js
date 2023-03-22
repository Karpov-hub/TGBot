'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
    }
  }
  user.init({
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID
    },
    email: DataTypes.STRING(40),
    password: DataTypes.STRING(50),
    surname: DataTypes.STRING(30),
    name: DataTypes.STRING(30),
    patronymic: DataTypes.STRING(30),
    phone: DataTypes.STRING(20),
    roll: DataTypes.INTEGER,
  }, {
    sequelize,
    createdAt: false,
    updatedAt: false,
    modelName: 'user',
  });
  return user;
};