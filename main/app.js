const app = require("./index");
const db = require("./src/models");
const serverless = require("serverless-http");
const dotenv = require("dotenv");
dotenv.config();

db.mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

module.exports.handler = serverless(app);
