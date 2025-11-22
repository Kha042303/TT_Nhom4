// back-end/api/v1/routes/book.route.js
const express = require("express");
const router = express.Router();

const bookController = require("../controller/book.controller.js");
const upload = require("../middlewares/upload.middleware.js"); 

// GET /api/v1/book
router.get("/", bookController.index);

router.patch("/change-status/:id", bookController.changeStatus);

router.post("/create", upload.array("images", 10), bookController.create);

router.patch("/edit/:id", upload.array("images", 10), bookController.edit);

router.delete("/delete/:id", bookController.delete);

module.exports = router;
