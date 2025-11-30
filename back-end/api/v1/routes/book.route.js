const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const bookController = require("../controller/book.controller.js");
const uploadBook = require("../middlewares/book.upload.middleware.js");

router.get("/", bookController.index);

router.get("/detail/:id", bookController.detail);

router.post("/create", auth, uploadBook, bookController.create);

router.patch("/edit/:id", auth, uploadBook, bookController.edit);

router.patch("/change-status/:id", auth, bookController.changeStatus);

router.delete("/delete/:id", auth, bookController.delete);

module.exports = router;
