const db = require("../models");
const schema = db.loginInfo;

const checkLoginDetails = async (req, res, next) => {
  const data = {
    email: req.body.email,
    password: req.body.password,
  };
  const { error, value } = schema.validate(data);
  if (error) {
    res.status(400).json({ message: "invalid inputs" });
  }
  next();
};

const verifyLogin = { checkLoginDetails };

module.exports = verifyLogin;
