const jwt = require("jsonwebtoken");
const db = require("../models");
const dotenv = require("dotenv");
const User = db.user;

dotenv.config();

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findById(req.userId)
    .exec()
    .then((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user.is_superadmin) {
        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
      next();
    });
};

isStaff = (req, res, next) => {
  User.findById(req.userId)
    .exec()
    .then((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user.is_staff) {
        res.status(403).send({ message: "Require Staff Role!" });
        return;
      }
      next();
    });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isStaff,
};
module.exports = authJwt;
