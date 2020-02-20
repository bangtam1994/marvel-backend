const express = require("express");
const router = express.Router();
const axios = require("axios");
const md5 = require("js-md5");
const uid2 = require("uid2");

require("dotenv").config();

// API KEY

//Route pour get characters par page

router.get("/characters", async (req, res) => {
  const myPublicKey = process.env.myPublicKey;
  const myPrivateKey = process.env.myPrivateKey;
  const ts = uid2(4);
  const hash = md5(ts + myPrivateKey + myPublicKey);
  const limit = 100; //Me donnera les 100 résultats par page

  const page = req.query.page;
  //Pour search
  const search = req.query.search;

  //Pour pagination
  const offset = limit * (page - 1); //Pour me donner la pagination
  const myApi = `http://gateway.marvel.com/v1/public/characters?limit=${limit}&offset=${offset}&ts=${ts}&apikey=${myPublicKey}&hash=${hash}`;

  const myApiSearch = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${search}&ts=${ts}&apikey=${myPublicKey}&hash=${hash}`;
  try {
    if (search) {
      const response = await axios.get(myApiSearch);
      res.json(response.data);
    } else {
      const response = await axios.get(myApi);
      res.json(response.data);
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

//Route pour get 1 character par son id
router.get("/character/:id", async (req, res) => {
  try {
    const myPublicKey = process.env.myPublicKey;
    const myPrivateKey = process.env.myPrivateKey;
    const ts = uid2(4);
    const hash = md5(ts + myPrivateKey + myPublicKey);
    let characterId = req.params.id;
    // console.log("le CHARACTERID est ///////", characterId);
    const myApiComics = `http://gateway.marvel.com/v1/public/characters/${characterId}/comics?apikey=${myPublicKey}&ts=${ts}&hash=${hash}`;

    // console.log("MY API EST ///////", myApi);

    const response = await axios.get(myApiComics);
    res.json(response.data);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/character/info/:id", async (req, res) => {
  try {
    const myPublicKey = process.env.myPublicKey;
    const myPrivateKey = process.env.myPrivateKey;
    const ts = uid2(4);
    const hash = md5(ts + myPrivateKey + myPublicKey);
    let characterId = req.params.id;
    const myApiCharacter = `http://gateway.marvel.com/v1/public/characters/${characterId}?apikey=${myPublicKey}&ts=${ts}&hash=${hash}`;

    const response = await axios.get(myApiCharacter);
    res.json(response.data);
  } catch (error) {
    console.log(error.message);
  }
});

// Route pour get les infos sur les comics

router.get("/comics", async (req, res) => {
  const myPublicKey = process.env.myPublicKey;
  const myPrivateKey = process.env.myPrivateKey;
  const ts = uid2(4);
  const hash = md5(ts + myPrivateKey + myPublicKey);
  const limit = 100;
  const page = req.query.page;
  const search = req.query.search;

  const offset = limit * (page - 1);
  const myApi = `http://gateway.marvel.com/v1/public/comics?limit=${limit}&offset=${offset}&ts=${ts}&apikey=${myPublicKey}&hash=${hash}`;
  const myApiSearch = `https://gateway.marvel.com/v1/public/comics?titleStartsWith=${search}&ts=${ts}&apikey=${myPublicKey}&hash=${hash}`;
  console.log("MY API SEARCH", myApiSearch);
  try {
    if (search) {
      const response = await axios.get(myApiSearch);
      res.json(response.data);
      console.log(response.data);
    } else {
      const response = await axios.get(myApi);
      res.json(response.data);
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

// Route pour get les favoris

router.get("/favorites", async (req, res) => {
  const myPublicKey = process.env.myPublicKey;
  const myPrivateKey = process.env.myPrivateKey;
  const ts = uid2(4);
  const hash = md5(ts + myPrivateKey + myPublicKey);
  const limit = 100;
  const fav = req.query.fav; // Va recevoir une string de plusieurs identifiants : "1122, 333, 22"
  console.log("BACKEND : LE FAV EST :", fav);
  try {
    let newFavCharacters;
    if (fav !== null) {
      // Je transforme la cookie (string) de myFavCharacters en un tableau d'ID pour mapper par la suite dessus

      newFavCharacters = JSON.parse("[" + fav + "]");
      // newFavCharacters = [111, 222, 333]  ---> Tableaux de chiffres
      let resultFav = [];

      for (let i = 0; i < newFavCharacters.length; i++) {
        const response = await axios.get(
          `http://gateway.marvel.com/v1/public/characters/${newFavCharacters[i]}?apikey=${myPublicKey}&ts=${ts}&hash=${hash}`
        );

        let newObj = {};

        newObj.id = response.data.results[0].id;
        newObj.name = response.data.results[0].name;
        newObj.description = response.data.results[0].description;

        newObj.urlPicture =
          response.data.results[0].thumbnail.path +
          ".".response.data.results[0].thumbnail.extension;
        resultFav.push(newObj);
      }
      res.json(resultFav);
    } else {
      res.json("No fav added!");
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
