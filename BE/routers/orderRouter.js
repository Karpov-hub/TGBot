const router = require("./main.router");
const {
  createOrder,
  readOrders,
  //   updateOrder,
  //   deleteOrder,
  placeOrder,
  readUnassignedOrders,
} = require("../controllers/orderController");
const { verifyToken } = require("./middleware"); // Подключаем middleware для проверки токена

router.post("/create-order", verifyToken, createOrder);
router.post("/read-orders", verifyToken, readOrders);
// router.post("/update-order", verifyToken, updateOrder);
// router.post("/delete-order", verifyToken, deleteOrder);
// router.post("/place-order", verifyToken, placeOrder);
router.post("/read-nassigned-order", verifyToken, readUnassignedOrders);

module.exports = router;
