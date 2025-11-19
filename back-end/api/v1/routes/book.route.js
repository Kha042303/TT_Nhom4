const express = require("express");
const router = express.Router();

const bookController = require("../controller/book.controller.js");

// GET /api/v1/book
router.get("/", bookController.index);

router.patch("/change-status/:id", bookController.changeStatus);

router.post("/create", bookController.create);

router.patch("/edit/:id", bookController.edit);
router.delete("/delete/:id", bookController.delete);
module.exports = router;
