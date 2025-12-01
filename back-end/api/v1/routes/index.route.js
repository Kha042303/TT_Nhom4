// back-end/api/v1/routes/index.route.js
const Bookroute = require("./book.route.js");
const Userroute = require("./users.route.js");
const Postroute = require("./post.route.js");
const Chatroute = require("./chat.route.js");
module.exports = (app) => {
  const version = "/api/v1";
  app.use(version + "/book", Bookroute);
  app.use(version + "/user", Userroute);
  app.use(version + "/post", Postroute);
  app.use(version + "/chat", Chatroute);
};
