const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = 3000;

app.use(bodyParser.json({ limit: "8mb" }));
app.use(bodyParser.urlencoded({ limit: "8mb", extended: true }));


const productRouter = require("../BE/routers/productRouter");
app.use("/product", productRouter);

app.listen(port, () => {
  console.log(`App listen port: http://localhost:${port}`);
});
