const crypto = require("crypto");
const db = require("@db/models/index");
const {
  createToken,
  deleteToken,
  refreshExpiry,
  checkToken,
} = require("@redisFun");

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
    let session_token = await createToken(admin.id);
    return res.send({ success: true, session_token });
  } else {
    return res.send({ success: false, message: "Failed to authorize" });
  }
}

async function changePassword(req, res) {
  try {
    let id = await checkToken(req.headers.session_token);

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
  if (await refreshExpiry(req.headers.session_token))
    return res.send({ success: true });
  return res.send({ success: false });
}

async function logout(req, res) {
  if (await checkToken(req.headers.session_token)) {
    await deleteToken(req.headers.session_token);
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
