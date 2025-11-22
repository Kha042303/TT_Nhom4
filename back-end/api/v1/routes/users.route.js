const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller.js");
const Validate = require("../../../validates/user.validates.js");

router.post("/register", Validate.registerPost, userController.register);
router.post("/login", userController.login);
// router.post("/password/forgot", userController.forgotPassword);
router.get("/profile", userController.getProfile);
router.patch("/profile/edit/:id", userController.editProfile);
router.patch("/change-password/:id", userController.changePassword);

module.exports = router;




