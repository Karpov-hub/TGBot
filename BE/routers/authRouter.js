const router = require("./main.router");
const {
  signin,
  refreshToken,
  changePassword,
  logout,
} = require("../controllers/authController");
const { verifyToken } = require("./middleware"); // Подключаем middleware для проверки токена

router.post("/signin", signin);
router.post("/refresh-token", refreshToken);
router.post("/change-password", verifyToken, changePassword);
router.post("/logout", verifyToken, logout);

module.exports = router;
