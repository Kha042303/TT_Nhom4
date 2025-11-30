const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller.js");
const Validate = require("../../../validates/user.validates.js");
const auth = require("../middlewares/auth.middleware");

router.post("/register", Validate.registerPost, userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
// router.post("/password/forgot", userController.forgotPassword);
router.get("/profile", userController.getProfile);
router.get("/profileid/:id",auth ,userController.getProfileid);
// router.patch("/profile/edit/:id", userController.editProfile);
// router.patch("/change-password/:id", userController.changePassword);
module.exports = router;




