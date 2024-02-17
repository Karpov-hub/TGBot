const router = require("./main.router");
const {
  // createUser,
  readUsers,
  readNewUsers,
  updateUser,
  regUser,
  // deleteUser,
} = require("../controllers/userController");
const { verifyToken } = require("./middleware"); // Подключаем middleware для проверки токена

// router.post("/create-user", createUser);
router.post("/read-users", verifyToken, readUsers);
router.post("/read-new-user", verifyToken, readNewUsers);
router.post("/update-user", verifyToken, updateUser);
router.post("/reg-user", verifyToken, regUser);
// router.post("/delete-user", deleteUser);

module.exports = router;
