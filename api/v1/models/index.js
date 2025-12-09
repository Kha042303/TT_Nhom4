const fs = require("fs");
const path = require("path");
const { sequelize } = require("../../../config/database.js");
const Sequelize = require("sequelize");

const db = {};

fs.readdirSync(__dirname)
  .filter(file =>
    file !== "index.js" &&
    file.endsWith(".js")
  )
  .forEach(file => {
    const model = require(path.join(__dirname, file));

    // Fix quan trọng
    const modelName = model.name || model.options?.name?.singular;
    db[modelName] = model;
  });

// Gọi associate sau khi toàn bộ model đã load
Object.keys(db).forEach(modelName => {
  if (typeof db[modelName].associate === "function") {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
