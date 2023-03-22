const db = require("../db/models/index");
const { Op, where } = require("sequelize");

async function createProduct(req, res) {
  try {
    await db.product.create({
      category_name: req.body.category_name,
      name: req.body.name,
      ingredients: req.body.ingredients,
      price: req.body.price,
    });
    return res.send({ success: true });
  } catch (err) { return res.send({ success: false, err }); }
};

async function readProducts(req, res) {
  try {
    let { count, rows } = await db.product.findAndCountAll();

    return res.send({ success: true, count, rows });
  } catch (e) {
    return res.send({ success: false });
  }
};

async function updateProduct(req, res) {
  try {
    const updatingOptions = {
      category_name: req.body.category_name,
      name: req.body.name,
      ingredients: req.body.ingredients,
      price: req.body.price,
    };

    await db.product.update(updatingOptions, {
      where: {
        id: req.body.id,
      },
    });
    return res.send({ success: true });
  } catch (err) { return res.send({ success: false }); }
};

async function deleteProduct(req, res) {
  try {
    await db.product.destroy({
      where: {
        id: req.body.id
      }
    });

    return res.send({ success: true });
  } catch (e) {
    return res.send({ success: false });
  }
};

module.exports = {
  createProduct,
  readProducts,
  updateProduct,
  deleteProduct,
};