const router = require("./main.router");
const { readAdmins, updateAdmin } = require("../controllers/adminController");
const { verifyToken } = require("./middleware"); // Подключаем middleware для проверки токена

// Применяем middleware только для нужных маршрутов
router.post("/read-admins", verifyToken, readAdmins);
router.post("/update-admin", verifyToken, updateAdmin);

module.exports = router;
