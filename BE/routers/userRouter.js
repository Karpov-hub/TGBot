const express = require("express");
const {
  // createUser,
  readUsers,
  readNewUsers,
  // updateUser,
  regUser,
  // deleteUser,
} = require("../controllers/userController");
const router = express.Router();

// router.post("/create-user", createUser);
router.post("/read-users", readUsers);
router.post("/read-new-user", readNewUsers);
// router.post("/update-user", updateUser);
router.post("/reg-user", regUser);
// router.post("/delete-user", deleteUser);

module.exports = router;
