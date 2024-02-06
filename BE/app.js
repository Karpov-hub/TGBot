const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Убедитесь, что у вас есть токен вашего бота
const token = "6883415167:AAFQNSnFL-s73ORXuKuRnjRqlZw0Q7APzGY";
const bot = new TelegramBot(token, { polling: true });

app.use(bodyParser.json({ limit: "8mb" }));
app.use(bodyParser.urlencoded({ limit: "8mb", extended: true }));

// Обработка запросов от телеграма
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Запуск Express сервера
const server = app.listen(port, () => {
  console.log(`App listen port: http://localhost:${port}`);
});

// Обработка ошибок
server.on("error", (error) => {
  console.error("Server error:", error);
});
