const express = require("express");

const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  // Si j'ai un bien entré un token dans le post :
  try {
    if (req.headers.authorization) {
      const user = await User.findOne({
        token: req.headers.authorization.replace("Bearer ", "")
      }); // Va chercher le User avec cet exact token entré sans le bearer

      if (!user) {
        // Si je n'ai pas trouvé de user correspondant
        res.json({ message: "Token invalid" });
      } else {
        req.user = user; // la requête req va avoir une clé supplémentaire appelée "user" qui aura toutes les infos de user ()
        next();
      }
    } else {
      // je n'ai pas entré de token dans le post
      res.json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = isAuthenticated;
