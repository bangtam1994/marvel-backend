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
    const myApi = `http://gateway.marvel.com/v1/public/characters/${characterId}/comics?apikey=${myPublicKey}&ts=${ts}&hash=${hash}`;

    // console.log("MY API EST ///////", myApi);

    const response = await axios.get(myApi);
    res.json(response.data);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/comics", async (req, res) => {
  const myPublicKey = process.env.myPublicKey;
  const myPrivateKey = process.env.myPrivateKey;
  const ts = uid2(4);
  const hash = md5(ts + myPrivateKey + myPublicKey);
  const limit = 100;
  const page = req.query.page;
  const offset = limit * (page - 1);
  const myApi = `http://gateway.marvel.com/v1/public/comics?limit=${limit}&offset=${offset}&ts=${ts}&apikey=${myPublicKey}&hash=${hash}`;
  console.log("MY API EST ///////", myApi);

  try {
    const response = await axios.get(myApi);
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
