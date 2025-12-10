const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const database = require("./config/database");
require("dotenv").config();

const routerVersion1 = require("./api/v1/routes/index.route");
const setupSocket = require("./socket.io"); 

const app = express();
const PORT = process.env.PORT;

// ===================== DEBUG SECRET ===================== //

console.log("ACCESS_TOKEN_SECRET =", process.env.ACCESS_TOKEN_SECRET);

if (!process.env.ACCESS_TOKEN_SECRET) {
  console.error("❌ Lỗi: ACCESS_TOKEN_SECRET không có giá trị. Hãy thêm vào file .env");
  // KHÔNG exit(), chỉ cảnh báo → đúng yêu cầu bạn
}

// ======================================================== //

app.use(cors());
app.use(cookieParser());
database.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "images")));

routerVersion1(app);

const server = setupSocket(app);

server.listen(PORT, () => {
  console.log(`App + Socket.IO running at port ${PORT}`);
});
