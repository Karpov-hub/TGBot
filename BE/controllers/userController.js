const db = require("../db/models/index");
const { Op, where } = require("sequelize");

async function createUser(req, res) {
  try {
    await db.user.create({
      category_name: req.body.category_name,
      name: req.body.name,
      ingredients: req.body.ingredients,
      price: req.body.price,
    });
    return res.send({ success: true });
  } catch (err) { return res.send({ success: false, err }); }
};

async function readUsers(req, res) {
  try {
    let { count, rows } = await db.user.findAndCountAll();

    return res.send({ success: true, count, rows });
  } catch (e) {
    return res.send({ success: false });
  }
};

async function updateUser(req, res) {
  try {
    const updatingOptions = {
      category_name: req.body.category_name,
      name: req.body.name,
      ingredients: req.body.ingredients,
      price: req.body.price,
    };

    await db.user.update(updatingOptions, {
      where: {
        id: req.body.id,
      },
    });
    return res.send({ success: true });
  } catch (err) { return res.send({ success: false }); }
};

async function deleteUser(req, res) {
  try {
    await db.user.destroy({
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
  createUser,
  readUsers,
  updateUser,
  deleteUser,
};