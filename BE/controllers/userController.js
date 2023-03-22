const db = require("../db/models/index");
const { Op, where } = require("sequelize");

async function createUser(req, res) {
  try {
    await db.user.create({
      email: req.body.email,
      password: req.body.password,
      surname: req.body.surname,
      name: req.body.name,
      patronymic: req.body.patronymic,
      phone: req.body.phone,
      roll: req.body.roll,
    });
    return res.send({ success: true });
  } catch (err) { return res.send({ success: false, err }); }
};

async function readUsers(req, res) {
  try {
    let { count, rows } = await db.user.findAndCountAll();

    return res.send({ success: true, count, rows });
  } catch (err) { return res.send({ success: false, err }); }
};

async function updateUser(req, res) {
  try {
    const updatingOptions = {
      email: req.body.email,
      password: req.body.password,
      surname: req.body.surname,
      name: req.body.name,
      patronymic: req.body.patronymic,
      phone: req.body.phone,
      roll: req.body.roll,
    };

    await db.user.update(updatingOptions, {
      where: {
        id: req.body.id,
      },
    });
    return res.send({ success: true });
  } catch (err) { return res.send({ success: false, err }); }
};

async function deleteUser(req, res) {
  try {
    await db.user.destroy({
      where: {
        id: req.body.id
      }
    });

    return res.send({ success: true });
  } catch (err) { return res.send({ success: false, err }); }
};

module.exports = {
  createUser,
  readUsers,
  updateUser,
  deleteUser,
};