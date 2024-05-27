const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      first_name: String,
      last_name: String,
      state: String,
      email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
      },
      password: {
        type: String,
      },
      is_staff: {
        type: Boolean,
        default: false,
      },
      is_superadmin: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  ),
  "user_account"
);

module.exports = User;
