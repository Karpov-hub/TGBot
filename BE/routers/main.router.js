const express = require("express");
const router = express.Router();
const Validator = require("jsonschema").Validator;
const multer = require("multer");

const jsonV = new Validator();

const schemasList = require("./schemas");

function getSchema(path) {
  let schema = schemasList;
  for (let route of path) {
    route =
      route.indexOf("?") > 0 ? route.substring(0, route.indexOf("?")) : route;

    schema = schema[route];
  }
  return schema;
}
router.use(
  "/*",
  multer().fields([
    { name: "file" },
    { name: "files_list" },
    { name: "attached_files" },
  ]),
  async (req, res, next) => {
    if (req.files) {
      if (req.files.file) req.body.file = req.files.file[0];
      if (req.files.files_list) req.body.files_list = req.files.files_list;
      if (req.files.attached_files)
        req.body.attached_files = req.files.attached_files;
    }
    let path = req.originalUrl.substring(1).split("/");
    let valid;
    if (path[1] && path[1] == "download") valid = true;
    else {
      let schema = getSchema(path);
      if (!schema) return res.send({ code: "SCHEMANOTFOUND" });
      valid = jsonV.validate(req.body, schema);
    }
    if (valid && valid.errors && valid.errors.length)
      return res.send({
        status: "VALIDATIONSCHEMAERROR",
        errors: valid.errors,
      });
    if (req.files) {
      if (req.files.file)
        req.body.file = await prepareFiles(req.files.file[0]).catch((e) => {
          return res.send({ code: "PREPAREFILEERROR", message: e });
        });
      if (req.files.files_list?.length || req.files.attached_files?.length) {
        req.body.files = [];
        let files_arr = req.files.files_list || req.files.attached_files;
        for (let file of files_arr) {
          req.body.files.push(
            await prepareFiles(file).catch((e) => {
              console.log(e);
              return res.send({ code: "PREPAREFILEERROR", message: e });
            })
          );
        }
      }
    }
    next();
  }
);
router.get("/download/:code", async (req, res) => {
  downloadFile(req, res);
});

module.exports = router;
