const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const database = require("./config/database");
require("dotenv").config();
const routerVersion1=require("./api/v1/routes/index.route");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
database.connect();

app.use(bodyParser.json());

routerVersion1(app);

app.listen(PORT, () => {
  console.log(`app listening on :${PORT}`);
});
