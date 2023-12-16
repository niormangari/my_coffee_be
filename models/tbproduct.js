"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TbProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TbProduct.init(
    {
      productName: DataTypes.STRING,
      price: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      img: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "TbProduct",
    }
  );
  return TbProduct;
};
