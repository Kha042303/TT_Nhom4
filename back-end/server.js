const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({
    origin: "http://localhost:5173", // thay nếu FE chạy port khác
    credentials: true,
  }));
app.use(express.json());

// Import route
const userRoutes = require("./api/v1/routes/users.route");
// const datphongRoutes = require("./routes/datphongRoutes");
// const khachhangRoutes = require("./routes/khachhangRoutes");
// const hoadonRoutes = require("./routes/hoadonRoutes");
// const phongRoutes = require("./routes/phongRoutes");

// Dùng route
app.use("/api/user", userRoutes);
// app.use("/api/datphong", datphongRoutes);
// app.use("/api/khachhang", khachhangRoutes);
// app.use("/api/hoadon", hoadonRoutes);
// app.use("/api/phong", phongRoutes);

app.get("/", (req, res) => {
    res.send("🔥 API Quản lý khách sạn đang hoạt động!");
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`));