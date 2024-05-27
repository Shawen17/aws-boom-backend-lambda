const app = require("./index");
const db = require("./src/models");
const serverless = require("serverless-http");

db.mongoose
  .connect(
    "mongodb+srv://shawen17:Shawenbaba1@shawencluster.jzsljb4.mongodb.net/user_details"
  )
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

module.exports.handler = serverless(app);
