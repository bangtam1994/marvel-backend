const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const isAuthenticated = require("../middleware/isAuthenticated");
const md5 = require("js-md5");
const axios = require("axios");
const User = require("../models/User");

// Route pour se créer un compte

router.post("/user/sign_up", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });

    if (user) {
      res.json({ message: "Email already exist" });
    } else {
      if (req.fields.email && req.fields.password && req.fields.username) {
        const token = uid2(64);
        const salt = uid2(64);
        const hash = SHA256(req.fields.password + salt).toString(encBase64);

        const user = new User({
          email: req.fields.email,
          username: req.fields.username,
          token: token,
          salt: salt,
          hash: hash
        });

        await user.save();

        res.json({
          _id: user._id,
          token: user.token,
          username: user.username
        });
      } else {
        res.json({ error: "Missing information to create user" });
      }
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

//Route pour se logger
router.post("/user/log_in", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });
    if (user) {
      if (
        SHA256(req.fields.password + user.salt).toString(encBase64) ===
        user.hash
      ) {
        res.json({
          _id: user._id,
          token: user.token,
          username: user.username
        });
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      res.json({ message: "User not found" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.json({ message: error.message });
  }
});

//Route pour ajouter un favori à un user

router.post("/user/add/favorites", isAuthenticated, async (req, res) => {
  try {
    const { marvelId, type } = req.fields;

    const user = await User.findById(req.user._id);
    console.log("USER IN BACKEND IS ", user);

    const find = await user.favorites.find(ref => {
      if (ref.marvelId === marvelId) {
        return true;
      } else {
        return false;
      }
    });

    if (user) {
      if (!find) {
        user.favorites.push({ marvelId: marvelId, type: type });
        console.log("AFTER PUSH, USER IS ", user);
        await user.save();
        res.json(user.favorites);
      } else {
        res.json("Favorite already added");
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.json(error.message);
  }
});

//Route pour delete un favori à un user

router.post("/user/delete/favorites", isAuthenticated, async (req, res) => {
  try {
    const { marvelId, type } = req.fields;
    const user = await User.findById(req.user._id);
    console.log("la");

    if (user) {
      let index;

      for (let i = 0; i < user.favorites.length; i++) {
        if (user.favorites[i].marvelId === marvelId) {
          index = i;
          break;
        }
      }
      if (index > -1) {
        user.favorites.splice(index, 1);
        await user.save();
        res.json("Favorite deleted");
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.json(error.message);
  }
});

// Route simple pour afficher les favoris enregistré dans MongoDB

router.get("/user/favorites/check", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.favorites);
  } catch (error) {
    res.json({ message: error.message });
  }
});

// Route pour afficher les favoris du User depuis l'API marvel

router.get("/user/favorites/", isAuthenticated, async (req, res) => {
  const myPublicKey = process.env.MY_PUBLIC_KEY;
  const myPrivateKey = process.env.MY_PRIVATE_KEY;
  const ts = uid2(4);
  const hash = md5(ts + myPrivateKey + myPublicKey);
  let tabFavCharac = [];
  let tabFavComic = [];

  try {
    // Recherche du User dans MongoDB
    const user = await User.findById(req.user._id);
    //user.favorites = [{marvelId, type:comic}, {marvelId, type:charac}, ]
    if (user) {
      if (user.favorites && user.favorites.length !== 0) {
        //Construction des 2 tableaux Favoris (comic et charac)
        for (let i = 0; i < user.favorites.length; i++) {
          if (user.favorites[i].type === "charac") {
            tabFavCharac.push(user.favorites[i]);
          } else {
            tabFavComic.push(user.favorites[i]);
          }
        }
        // Envoi de la requête Character à marvel
        let resultFavCharac = [];

        for (let i = 0; i < tabFavCharac.length; i++) {
          let link = `https://gateway.marvel.com/v1/public/characters/${tabFavCharac[i].marvelId}?apikey=${myPublicKey}&ts=${ts}&hash=${hash}`;
          const response = await axios.get(link);
          let newObj = {};
          newObj.id = response.data.data.results[0].id;
          newObj.name = response.data.data.results[0].name;
          newObj.description = response.data.data.results[0].description;
          newObj.urlPicture =
            response.data.data.results[0].thumbnail.path +
            "/standard_medium." +
            response.data.data.results[0].thumbnail.extension;
          resultFavCharac.push(newObj);
        }

        // Envoi de la requête Comics à marvel
        let resultFavComic = [];
        for (let i = 0; i < tabFavComic.length; i++) {
          const response = await axios.get(
            `https://gateway.marvel.com/v1/public/comics/${tabFavComic[i]}?apikey=${myPublicKey}&ts=${ts}&hash=${hash}`
          );
          let newObj = {};
          newObj.id = response.data.data.results[0].id;
          newObj.name = response.data.data.results[0].title;
          newObj.description = response.data.data.results[0].description;
          newObj.urlPicture =
            response.data.data.results[0].thumbnail.path +
            "/standard_medium." +
            response.data.data.results[0].thumbnail.extension;

          resultFavComic.push(newObj);
        }
        console.log(resultFavCharac);

        res.json({ charac: resultFavCharac, comic: resultFavComic });
      } else {
        res.json("No favorites for this user");
      }
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
