const db = require("../db/models/index");
const { Op, where } = require("sequelize");

async function login(req, res) {
  try {
    let user = await db.user.findOne({
      where: { email: req.body.email },
      attributes: ["id", "email", "password", "role"]
    });
    if (!user)
      return res.send({ code: "AUTHENTICATIONFAILED" });
    if (
      crypto.createHash("sha256").update(req.body.password).digest("base64") ==
      user.password
    ) {
    return res.send({ success: true, role: user.get("role") });
    } else {
      return res.send({ code: "AUTHFAILED", message: "Failed to authorize" });
    }
  } catch (err) { return res.send({ success: false, err }); }
};

module.exports = {
  login,
};