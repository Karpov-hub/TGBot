const router = require("./main.router");
const {
  // createUser,
  readUsers,
  readNewUsers,
  updateUser,
  regUser,
  // deleteUser,
} = require("../controllers/userController");

// router.post("/create-user", createUser);
router.post("/read-users", readUsers);
router.post("/read-new-user", readNewUsers);
router.post("/update-user", updateUser);
router.post("/reg-user", regUser);
// router.post("/delete-user", deleteUser);

module.exports = router;
