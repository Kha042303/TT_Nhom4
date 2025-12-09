// back-end/api/v1/routes/index.route.js
const Bookroute = require("./book.route.js");
const Userroute = require("./users.route.js");
const Postroute = require("./post.route.js");
const Chatroute = require("./chat.route.js");
const Reportroute = require("./report.route.js");
const paymentRoutes = require("./payment.route.js");
module.exports = (app) => {
  const version = "/api/v1";
  app.use(version + "/book", Bookroute);
  app.use(version + "/user", Userroute);
  app.use(version + "/post", Postroute);
  app.use(version + "/chat", Chatroute);
  app.use(version + "/report", Reportroute);
  app.use(version + "/payment", paymentRoutes);

};
