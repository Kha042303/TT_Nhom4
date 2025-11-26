const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Thư mục vật lý lưu ảnh
const dir = "images/posts";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir); // -> images/posts
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const valid = ["image/jpeg", "image/png", "image/jpg"];
    if (!valid.includes(file.mimetype)) {
      return cb(new Error("Chỉ chấp nhận ảnh JPG/PNG"));
    }
    cb(null, true);
  }
});

module.exports = upload.array("images", 10); // max 10 ảnh
