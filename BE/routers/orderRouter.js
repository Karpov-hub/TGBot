const express = require("express");
const {
  createOrder,
  readOrders,
  //   updateOrder,
  //   deleteOrder,
  placeOrder,
  readUnassignedOrders,
} = require("../controllers/orderController");
const router = express.Router();

router.post("/create-order", createOrder);
router.post("/read-orders", readOrders);
// router.post("/update-order", updateOrder);
// router.post("/delete-order", deleteOrder);
router.post("/place-order", placeOrder);
router.post("/read-nassigned-order", readUnassignedOrders);

module.exports = router;
