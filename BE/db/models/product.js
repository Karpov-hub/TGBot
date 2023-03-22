'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  product.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    category_name: DataTypes.STRING,
    name: DataTypes.STRING,
    ingredients: DataTypes.STRING,
    price: DataTypes.INTEGER,
  }, {
    sequelize,
    createdAt: false,
    updatedAt: false,
    modelName: 'product',
  });
  return product;
};