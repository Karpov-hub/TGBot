const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json({ limit: "8mb" }));
app.use(bodyParser.urlencoded({ limit: "8mb", extended: true }));

const userRouter = require("../BE/routers/userRouter");
app.use("/user", userRouter);

const orderRouter = require("../BE/routers/orderRouter");
app.use("/order", orderRouter);

const authRouter = require("../BE/routers/authRouter");
app.use("/auth", authRouter);

const adminRouter = require("../BE/routers/adminRouter");
app.use("/admin", adminRouter);

app.use("/", (req, res) => {
  return res.send({ message: "404" });
});

module.exports = app;
