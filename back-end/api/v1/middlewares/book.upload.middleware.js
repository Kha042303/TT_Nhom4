// back-end/api/v1/middlewares/upload.middleware.js
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // thư mục uploads/ nằm ngay dưới back-end/
    cb(null, "images/books/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage });

module.exports = upload.array("images", 10);
