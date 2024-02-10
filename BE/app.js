const express = require("express");
const bodyParser = require("body-parser");
const telegramBot = require("./telegramBot");
const internalServer = require("./internalServer");

const app = express();
const port = 3000;
const internalPort = 3001; // Измененный порт для внутреннего сервера

app.use(bodyParser.json({ limit: "8mb" }));
app.use(bodyParser.urlencoded({ limit: "8mb", extended: true }));

// Обработка запросов от телеграма
app.post(`/bot${telegramBot.token}`, (req, res) => {
  telegramBot.processUpdate(req.body);
  res.sendStatus(200);
});

// Запуск Express сервера для внутренних запросов
internalServer.listen(internalPort, () => {
  console.log(
    `Internal server listening on port: http://localhost:${internalPort}`
  );
});

// Обработка ошибок
internalServer.on("error", (error) => {
  console.error("Internal Server error:", error);
});

// Запуск Express сервера
const server = app.listen(port, () => {
  console.log(`App listen port: http://localhost:${port}`);
});

// Обработка ошибок
server.on("error", (error) => {
  console.error("Server error:", error);
});
