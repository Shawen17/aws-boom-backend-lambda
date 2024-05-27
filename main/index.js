const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const db = require("./src/models");

const app = express();

// db.mongoose
//   .connect(
//     "mongodb+srv://shawen17:Shawenbaba1@shawencluster.jzsljb4.mongodb.net/user_details"
//   )
//   .then(() => {
//     console.log("Successfully connect to MongoDB.");
//   })
//   .catch((err) => {
//     console.error("Connection error", err);
//     process.exit();
//   });

const corOptions = {
  origin: "http://localhost:3000",
};

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
dotenv.config();

app.get("/", async (req, res) => {
  try {
    var response = await axios.get("https://restcountries.com/v3.1/all");
    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});

// Use the routes
require("./src/routes/auth.routes")(app);
require("./src/routes/user.routes")(app);

// const port = process.env.PORT || 3001;

// app.listen(port, () => {
//   console.log(`Listening on port ${port}....`);
// });

module.exports = app;
