const express = require("express");
const router = express.Router();

const adminController = require("../controller/admin.controller");
const auth = require("../middlewares/auth.middleware");
const checkRole = require("../middlewares/checkrole");

router.get("/users", auth, checkRole("admin"), adminController.getAdminUsers);
router.patch("/users/:id/block", auth, checkRole("admin"), adminController.toggleUserBlock);
router.delete("/users/:id", auth, checkRole("admin"), adminController.deleteUser);

module.exports = router;
