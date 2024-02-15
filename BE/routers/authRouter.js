const router = require("./main.router");
const {
  signin,
  refreshToken,
  changePassword,
  logout,
} = require("../controllers/authController");

router.post("/signin", signin);
router.post("/refreshToken", refreshToken);
router.post("/change-password", changePassword);
router.post("/logout", logout);

module.exports = router;
