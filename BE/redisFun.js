const redis = require("redis");
const crypto = require("crypto");
const { promisify } = require("util");
require("dotenv").config();

// Подключение к Redis
const client = redis.createClient({
  legacyMode: true,
});
client.connect().catch(console.error);

// Преобразование функций Redis в промисы
const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);
const delAsync = promisify(client.del).bind(client);
const expireAsync = promisify(client.expire).bind(client);

// Функция для генерации нового токена и его сохранения в Redis
async function createToken(userId) {
  try {
    const token = crypto.randomBytes(30).toString("base64"); // Замените эту строку на ваш код генерации токена
    await setAsync(token, userId);
    await expireAsync(token, process.env.TOKEN_EXPIRY_SECONDS);
    return token;
  } catch (error) {
    console.error("Ошибка при создании токена:", error);
    throw error;
  }
}

// Функция для удаления токена из Redis
async function deleteToken(token) {
  try {
    await delAsync(token);
  } catch (error) {
    console.error("Ошибка при удалении токена:", error);
    throw error;
  }
}

// Функция для обновления времени жизни токена в Redis
async function refreshExpiry(token) {
  try {
    await expireAsync(token, TOKEN_EXPIRY_SECONDS);
    return true;
  } catch (error) {
    console.error("Ошибка при обновлении времени жизни токена:", error);
    return false;
  }
}

// Функция для проверки токена
async function checkToken(token) {
  try {
    const userId = await getAsync(token);
    return userId;
  } catch (error) {
    console.error("Ошибка при проверке токена:", error);
    throw error;
  }
}

module.exports = {
  createToken,
  deleteToken,
  refreshExpiry,
  checkToken,
};
