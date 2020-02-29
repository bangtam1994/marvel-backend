const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const isAuthenticated = require("../middleware/isAuthenticated");
const md5 = require("js-md5");

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
    let marvelId = req.fields.marvelId;
    console.log("MARVEL ID IS ?", req.fields.marvelId);
    console.log("USER FROM FRONT IS?", req.user);

    const user = await User.findById(req.user._id);
    console.log("USER IN BACKEND IS ", user);
    if (user) {
      user.favorites.push(marvelId);
      console.log("AFTER PUSH, USER IS ", user);
      await user.save();
      res.json(user);
    }
  } catch (error) {
    console.log(error.message);
    return res.json(error.message);
  }
});

// Route pour afficher les favoris du User depuis l'API marvel

router.get("/user/favorites", async (req, res) => {
  const myPublicKey = "66db6be98f9cdefd20b3b38a1f9bfcbf";
  const myPrivateKey = "9777ea65bbc68773dbd54bfabb489c275db5b48e";
  const ts = uid2(4);
  const hash = md5(ts + myPrivateKey + myPublicKey);
  const limit = 100;
  const fav = req.query.fav; // Va recevoir un tableau
  console.log(">>>>>>> USER : LE FAV DU FRONTEND EST:", fav);

  try {
    let newFavCharacters;
    if (fav !== null) {
      // Je transforme la cookie (string) de myFavCharacters en un tableau d'ID pour mapper par la suite dessus
      newFavCharacters = JSON.parse("[" + fav + "]");
      // console.log("LE NOUVEAU FAV PARSE  EST ", newFavCharacters);

      // newFavCharacters = [111, 222, 333]  ---> Tableaux de chiffres
      let resultFav = [];
      try {
        for (let i = 0; i < newFavCharacters.length; i++) {
          // console.log("LE FAV CHARACTER [i] EST", newFavCharacters[i]);

          const response = await axios.get(
            `https://gateway.marvel.com/v1/public/characters/${newFavCharacters[i]}?apikey=${myPublicKey}&ts=${ts}&hash=${hash}`
          );
          console.log(
            ">>>>>> USER : LA REPONSE DE MARVEL EST:",
            response.data.data
          );

          let newObj = {};
          newObj.id = response.data.data.results[0].id;
          newObj.name = response.data.data.results[0].name;
          newObj.description = response.data.data.results[0].description;

          newObj.urlPicture =
            response.data.data.results[0].thumbnail.path +
            "/standard_medium." +
            response.data.data.results[0].thumbnail.extension;

          resultFav.push(newObj);
        }
        res.json(resultFav);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      res.json("No fav added!");
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

// Route GET les  favoris du user

router.get("/user/favorites", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.json({ message: error.message });
  }
});
module.exports = router;
