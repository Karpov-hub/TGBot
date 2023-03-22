const express = require("express");
const {
  createUser,
  readUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const router = express.Router();

router.post("/create-user", createUser);
router.post("/read-users", readUsers);
router.post("/update-user", updateUser);
router.post("/delete-user", deleteUser);

module.exports = router;