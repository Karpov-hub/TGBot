const express = require("express");

const { login } = require("../controllers/authController");

const { createUser } = require("../controllers/userController");

const router = express.Router();

router.post("/login", login);
router.post("/registration", createUser);

module.exports = router;
