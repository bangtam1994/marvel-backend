const express = require("express");
const router = express.Router();
const axios = require("axios");
const md5 = require("js-md5");
const uid2 = require("uid2");

require("dotenv").config();

//Route pour get characters par page

router.get("/characters", async (req, res) => {
  const myPublicKey = process.env.MY_PUBLIC_KEY;
  const myPrivateKey = process.env.MY_PRIVATE_KEY;
  const ts = uid2(4);
  const hash = md5(ts + myPrivateKey + myPublicKey);
  const limit = 100; //Me donnera les 100 résultats par page
  const page = req.query.page;
  console.log(page);
  //Pour search
  const search = req.query.search;

  //Pour pagination
  const offset = limit * (page - 1); //Pour me donner la pagination
  const myApi = `https://gateway.marvel.com/v1/public/characters?limit=${limit}&offset=${offset}&ts=${ts}&apikey=${myPublicKey}&hash=${hash}`;

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
    const myPublicKey = process.env.MY_PUBLIC_KEY;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;
    const ts = uid2(4);
    const hash = md5(ts + myPrivateKey + myPublicKey);
    let characterId = req.params.id;
    const myApiComics = `http://gateway.marvel.com/v1/public/characters/${characterId}/comics?apikey=${myPublicKey}&ts=${ts}&hash=${hash}`;

    const response = await axios.get(myApiComics);
    res.json(response.data);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/character/info/:id", async (req, res) => {
  try {
    const myPublicKey = process.env.MY_PUBLIC_KEY;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;
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
  const myPublicKey = process.env.MY_PUBLIC_KEY;
  const myPrivateKey = process.env.MY_PRIVATE_KEY;

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

router.get("/favorites/charac", async (req, res) => {
  const myPublicKey = process.env.MY_PUBLIC_KEY;
  const myPrivateKey = process.env.MY_PRIVATE_KEY;
  const ts = uid2(4);
  const hash = md5(ts + myPrivateKey + myPublicKey);
  const limit = 100;
  const fav = req.query.fav; // Va recevoir une string de plusieurs identifiants : "1122,333,22"
  // console.log("LE FAV DU FRONTEND EST:", fav);

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
          // console.log("LA REPONSE DE MARVEL EST:", response.data.data);

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

// Fav cookie for comics
router.get("/favorites/comics", async (req, res) => {
  const myPublicKey = process.env.MY_PUBLIC_KEY;
  const myPrivateKey = process.env.MY_PRIVATE_KEY;
  const ts = uid2(4);
  const hash = md5(ts + myPrivateKey + myPublicKey);
  const limit = 100;
  const fav = req.query.fav; // Va recevoir une string de plusieurs identifiants : "1122,333,22"

  try {
    let newFavComics;
    if (fav !== null) {
      newFavComics = JSON.parse("[" + fav + "]");

      let resultFav = [];
      try {
        for (let i = 0; i < newFavComics.length; i++) {
          const response = await axios.get(
            `https://gateway.marvel.com/v1/public/comics/${newFavComics[i]}?apikey=${myPublicKey}&ts=${ts}&hash=${hash}`
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

module.exports = router;
