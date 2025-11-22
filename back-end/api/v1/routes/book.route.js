// back-end/api/v1/routes/book.route.js
const express = require("express");
const router = express.Router();

const bookController = require("../controller/book.controller.js");
const upload = require("../middlewares/upload.middleware.js"); 

// GET /api/v1/book
router.get("/", bookController.index);
// GET /api/v1/book/detail/:id
router.get("/detail/:id", bookController.detail);
// PATCH /api/v1/book/change-status/:id
router.patch("/change-status/:id", bookController.changeStatus);
// POST /api/v1/book/create
router.post("/create", upload.array("images", 10), bookController.create);
// PATCH /api/v1/book/edit/:id
router.patch("/edit/:id", upload.array("images", 10), bookController.edit);
// DELETE /api/v1/book/delete/:id
router.delete("/delete/:id", bookController.delete);

module.exports = router;
