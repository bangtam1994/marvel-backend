const mongoose = require("mongoose");

const Favorite = mongoose.model("Favorite", {
  name: String,
  description: String,
  picture: String,
  username: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = Favorite;
