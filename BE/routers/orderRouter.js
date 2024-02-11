const express = require("express");
const {
  createOrder,
  readOrders,
  //   updateOrder,
  //   deleteOrder,
} = require("../controllers/orderController");
const router = express.Router();

router.post("/create-order", createOrder);
router.post("/read-orders", readOrders);
// router.post("/update-order", updateOrder);
// router.post("/delete-order", deleteOrder);

module.exports = router;
