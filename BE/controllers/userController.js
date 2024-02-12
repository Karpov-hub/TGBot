const db = require("../db/models/index");
const { Op, where } = require("sequelize");

// async function createUser(req, res) {
//   try {
//     let existUser = await db.user.findOne({
//       where: { phone: req.body.phone },
//       attributes: ["id"],
//     });
//     if (existUser) {
//       return res.send({
//         code: "PHONEALREADYREGISTERED",
//         message: "Sorry, you can't sign up with this phone id",
//       });
//     }

//     await db.user.create({
//       surname: req.body.surname,
//       name: req.body.name,
//       patronymic: req.body.patronymic,
//       phone: req.body.phone,
//       passport_photo: req.body.passport_photo,
//       status: req.body.status,
//     });
//     return res.send({ success: true });
//   } catch (err) {
//     return res.send({ success: false, err });
//   }
// }

async function readUsers(req, res) {
  try {
    let { count, rows } = await db.user.findAndCountAll();

    return res.send({ success: true, count, rows });
  } catch (err) {
    return res.send({ success: false, err });
  }
}

async function readNewUsers(req, res) {
  try {
    let { count, rows } = await db.user.findAndCountAll({
      where: { surname: null },
      attributes: ["id", "chat_id", "createdAt"],
    });

    return res.send({ success: true, count, rows });
  } catch (err) {
    return res.send({ success: false, err });
  }
}

async function updateUser(req, res) {
  try {
    const updatingOptions = {
      surname: req.body.surname,
      name: req.body.name,
      patronymic: req.body.patronymic,
      phone: req.body.phone,
      passport_photo: req.body.passport_photo,
      status: req.body.status,
    };

    await db.user.update(updatingOptions, {
      where: {
        id: req.body.id,
      },
    });
    return res.send({ success: true });
  } catch (err) {
    return res.send({ success: false, err });
  }
}

async function regUser(req, res) {
  try {
    const updatingOptions = {
      surname: req.body.surname,
      name: req.body.name,
      patronymic: req.body.patronymic,
      phone: req.body.phone,
      passport_photo: req.body.passport_photo,
    };

    await db.user.update(updatingOptions, {
      where: {
        id: req.body.id,
      },
    });
    return res.send({ success: true });
  } catch (err) {
    return res.send({ success: false, err });
  }
}

// async function deleteUser(req, res) {
//   try {
//     await db.user.destroy({
//       where: {
//         id: req.body.id,
//       },
//     });

//     return res.send({ success: true });
//   } catch (err) {
//     return res.send({ success: false, err });
//   }
// }

module.exports = {
  // createUser,
  readUsers,
  readNewUsers,
  updateUser,
  regUser,
  // deleteUser,
};
