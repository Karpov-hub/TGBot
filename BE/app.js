const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = 3000;

app.use(bodyParser.json({ limit: "8mb" }));
app.use(bodyParser.urlencoded({ limit: "8mb", extended: true }));


const userRouter = require("../BE/routers/userRouter");
app.use("/user", userRouter);

const authRouter = require("../BE/routers/authRouter");
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`App listen port: http://localhost:${port}`);
});
