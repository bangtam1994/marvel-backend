const mongoose = require("mongoose");

const User = mongoose.model("User", {
  username: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    unique: true
  },
  salt: String,
  token: String,
  hash: String,
  favorites: { type: Array }
});

module.exports = User;
