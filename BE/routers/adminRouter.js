const router = require("./main.router");
const { readAdmins, updateAdmin } = require("../controllers/adminController");

router.post("/read-admins", readAdmins);
router.post("/update-admin", updateAdmin);

module.exports = router;
