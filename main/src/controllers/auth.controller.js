const dotenv = require("dotenv");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/email/sendEmail");
const db = require("../models");
const User = db.user;
const Token = db.token;

dotenv.config();

exports.signup = async (req, res) => {
  const user = new User({
    email: req.body.email,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    state: req.body.state,
    is_staff: false,
    is_superadmin: false,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  await user.save().then((user, err) => {
    if (!user) {
      res.status(500).json({ message: err });
      return;
    }
    res.status(201).json({
      message: "User was registered successfully!",
    });
  });
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      return res.status(404).json({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        token: null,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours
    });

    res.status(200).json({
      user: user,
      token: token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.requestPasswordReset = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email }).exec();

  if (!user) {
    res.status(404).json({ message: "User not found" });
  }
  let token = await Token.findOne({ userId: user._id });
  if (token) await token.deleteOne();
  let resetToken = crypto.randomBytes(32).toString("hex");
  const hash = bcrypt.hashSync(resetToken, 8);

  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `${process.env.CLIENT_URL}/password/reset/confirm/${user._id}/${resetToken}`;
  sendEmail(
    user.email,
    "Password Reset Request",
    { name: user.last_name, link: link },
    "/template/requestResetPassword.handlebars"
  );
  res.status(200).json({
    message: "Reset Link sent to your Email",
  });
};

exports.resetPassword = async (req, res) => {
  const userId = req.body.uid;
  const token = req.body.token;
  const password = req.body.new_password;
  let passwordResetToken = await Token.findOne({ userId });
  if (!passwordResetToken) {
    res
      .status(400)
      .json({ message: "Invalid or expired password reset token" });
  }
  const isValid = bcrypt.compareSync(token, passwordResetToken.token);
  if (!isValid) {
    res
      .status(400)
      .json({ message: "Invalid or expired password reset token" });
  }
  const hash = bcrypt.hashSync(password, 8);
  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );
  const user = await User.findById({ _id: userId });
  sendEmail(
    user.email,
    "Password Reset Successfully",
    {
      name: user.last_name,
    },
    "/template/resetPassword.handlebars"
  );
  await passwordResetToken.deleteOne();
  res.status(200).json({ message: "Password Reset Successfully" });
};
