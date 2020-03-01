const express = require("express");
const mongoose = require("mongoose");
const formidableMiddleware = require("express-formidable");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(formidableMiddleware());

mongoose.connect("mongodb://localhost/marvel-backend", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const marvelRoutes = require("./routes/marvel");
app.use(marvelRoutes);

const userRoutes = require("./routes/user");
app.use(userRoutes);

app.all("*", (req, res) => {
  res.json({ message: "Page not found" });
});

app.listen(4000, () => console.log("Server started"));
