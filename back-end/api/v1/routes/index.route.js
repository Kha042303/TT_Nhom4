const Bookroute = require("./book.route.js");

module.exports = (app) => {

  const version = "/api/v1";
  app.use(version + "/book", Bookroute);
};