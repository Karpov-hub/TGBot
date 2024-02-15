const db = require("../db/models/index");
const crypto = require("crypto");
const redis = require("..node_modules/redis");
async function signin(req, res) {
  let admin = await db.admin.findOne({
    where: { login: req.body.login },
    attributes: ["id", "login", "password"],
  });
  if (!admin) return res.send({ code: "AUTHENTICATIONFAILED" });
  if (
    crypto.createHash("sha256").update(req.body.password).digest("base64") ==
    admin.password
  ) {
    let session_token = crypto.randomBytes(30).toString("base64");
    await redis.set(session_token, admin.get("id"), config.token_lifetime);
    return res.send({ success: true, session_token });
  } else {
    return res.send({ success: false, message: "Failed to authorize" });
  }
}

async function changePassword(req, res) {
  try {
    let id = await redis.get(req.body.session_token);

    let admin = await db.admin.findOne({
      where: { id: id },
      attributes: ["password"],
    });
    if (
      crypto.createHash("sha256").update(req.body.password).digest("base64") ==
      admin.password
    ) {
      await db.admin.update(
        {
          password: crypto
            .createHash("sha256")
            .update(req.body.new_password)
            .digest("base64"),
        },
        {
          where: {
            id: id,
          },
        }
      );
      return res.send({
        success: true,
      });
    } else {
      return res.send({
        success: false,
      });
    }
  } catch (e) {
    return res.send({
      success: false,
      message: "Password has not been successfully changed",
    });
  }
}

async function refreshToken(req, res) {
  if (await redis.get(req.body.session_token))
    return res.send({ success: true });
  return res.send({ success: false });
}

async function logout(req, res) {
  if (await redis.get(req.body.session_token)) {
    await redis.del(req.body.session_token);
    return res.send({ success: true });
  }
  return res.send({ success: false });
}

module.exports = {
  signin,
  refreshToken,
  changePassword,
  logout,
};
