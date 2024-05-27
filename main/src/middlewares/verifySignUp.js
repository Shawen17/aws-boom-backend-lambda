const db = require("../models");
const User = db.user;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  await User.findOne({
    email: req.body.email,
  })
    .exec()
    .then((user, err) => {
      if (err) {
        res.status(500).json({ message: err });
        return;
      }

      if (user) {
        res.status(400).json({ message: "Failed! Email is already in use!" });
        return;
      }

      next();
    });
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;
