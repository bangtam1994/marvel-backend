// const express = require("express");
// const router = express.Router();
// const Favorite = require("../models/Favorite");
// const isAuthenticated = require("../middleware/isAuthenticated");

// router.post("/user/favorites", isAuthenticated, async (req, res) => {
//   try {
//     //Creation du favori
//     const newFavorite = new Favorite({
//       marvelId: req.fields.marvelId,
//       name: req.fields.name,
//       description: req.fields.description,
//       picture: req.fields.picture,
//       user: req.user //Ce favori va être lié à un user, son ID est envoyé en token dans le header
//     });

//     await newFavorite.save();

//     return res.json({
//       _id: newFavorite.id,
//       marvelId: newFavorite.marvelId,
//       name: newFavorite.name,
//       description: newFavorite.description,
//       user: {
//         username: newFavorite.user.username,
//         _id: newFavorite.user._id
//       }
//     });
//   } catch (error) {
//     console.log(error.message);
//     return res.json(error.message);
//   }
// });
