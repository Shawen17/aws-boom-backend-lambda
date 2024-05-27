const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");

db.loans = require("./loan.model");

db.loginInfo = require("./login.model");

db.token = require("./token.model");

module.exports = db;
