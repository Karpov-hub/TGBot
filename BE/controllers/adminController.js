const db = require("../db/models/index");
const { Op, where } = require("sequelize");
//addAdmin readAdmin readAdmins blockAdmin
async function readAdmins(req, res) {
  try {
    let { count, rows } = await db.admin.findAndCountAll();

    return res.send({ success: true, count, rows });
  } catch (err) {
    return res.send({ success: false, err });
  }
}

async function updateAdmin(req, res) {
  try {
    const updatingOptions = {
      login: req.body.login,
      password: req.body.password,
    };

    await db.admin.update(updatingOptions, {
      where: {
        id: req.body.id,
      },
    });
    return res.send({ success: true });
  } catch (err) {
    return res.send({ success: false, err });
  }
}
// }

module.exports = {
  readAdmins,
  updateAdmin,
};
