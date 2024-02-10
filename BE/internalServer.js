const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json({ limit: "8mb" }));
app.use(bodyParser.urlencoded({ limit: "8mb", extended: true }));

// Обработка внутренних POST запросов
app.post("/internal", (req, res) => {
  // Обработка внутренних POST запросов
  res.sendStatus(200);
});

module.exports = app;
