var express = require("express");
const {
  createProduct,
  readProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
var router = express.Router();

router.post("/create-product", createProduct);
router.post("/read-products", readProducts);
router.post("/update-product", updateProduct);
router.post("/delete-product", deleteProduct);

module.exports = router;