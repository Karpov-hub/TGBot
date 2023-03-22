const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = 3000;

// const multer = require("multer");
// const upload = multer({ dest: "./controllers/source" });

// const Ajv = require("ajv");
// const ajv = new Ajv();
// const { schema } = require("./schemas");

app.use(bodyParser.json({ limit: "8mb" }));
app.use(bodyParser.urlencoded({ limit: "8mb", extended: true }));

// app.use('*',upload.fields([{ name: "image" }]), (req, res, next) => {
//   console.log(req.files);
//   if (req.files) {
//     if (req.files.image) req.body.image = req.files.image[0];
//   }
//   const route = req.baseUrl;
//   const myroute = route.split("/");
//   const validate = ajv.compile(schema[myroute[1]][myroute[2]]);
//   const valid = validate(req.body);
//   if (!valid) {
//     return res.send(validate.errors);
//   }
//   next();
// });

const productRouter = require("../BE/routers/productRouter");
app.use("/product", productRouter);

app.listen(port, () => {
  console.log(`App listen port: http://localhost:${port}`);
});
