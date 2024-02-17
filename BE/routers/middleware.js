const { checkToken } = require("@redisFun");

// Middleware для проверки токена
const verifyToken = async (req, res, next) => {
  const token = req.headers.session_token;

  if (!token) {
    return res.status(401).json({ message: "Токен не предоставлен" });
  }

  try {
    const tokenValid = await checkToken(token); // Функция для проверки токена

    if (!tokenValid) {
      return res.status(401).json({ message: "Недействительный токен" });
    }

    // Если токен действителен, можно продолжить выполнение запроса
    next();
  } catch (error) {
    console.error("Ошибка при проверке токена:", error);
    return res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};

module.exports = { verifyToken };
