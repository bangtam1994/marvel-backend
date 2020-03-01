<h1  align="center">Marvel Backend</h1>

<a  href="https://marvel-frontend-by-bt.netlify.com/"><img  src="https://i.ibb.co/pQjwJ7N/Capture-d-e-cran-2020-02-29-a-23-27-39.png"  title="Marvel backend "  alt="Marvel backend"></a>

## Overview

**Server**

<a  href="https://marvel-frontend-by-bt.netlify.com/"  target="_blank"> [https://marvel-backend-bt.herokuapp.com/](https://marvel-backend-bt.herokuapp.com/)/</a>

API used : https://developer.marvel.com/

**Client**

Demo:<a  href="https://marvel-frontend-by-bt.netlify.com/"  target="_blank"> https://marvel-frontend-by-bt.netlify.com/</a>

## Packages

- Node.js

- Express

- Express-formidable

- Mongoose

- Crypto-js

- Uid2

- Cors

- Dotenv

## Architecture

Route marvel

- get characters : axios request to Marvel API
- get character by id : axios request to Marvel API
- get comics : axios request to Marvel API
- get favorites (by cookies) : axios request to Marvel API

Route user :

- signup : create a user account with crypted password (salt, hash) and token, all saved in mongoDB database
- login : route to decrypt the password + middleware (isAuthenticated)
- add favorite : create a favorite in User model
- delete favorite : to delete the favorite in User model
- favorites check : to display all favorites of the user
- favorites : axios request to Marvel API to display favorites

## Running the project

Clone this repository :

```
git clone https://github.com/bangtam1994/marvel-frontend-react.git

cd marvel-backend
```

To install packages :

```
npm install
```

or

```
yarn add
```

When installation is complete, run the project with:

```
npx nodemon index.js

```

## Marvel Client

- React

- HTTP request with axios (get, post)

- Hooks (useState, useEffect, useContext)

- React Router Dom

- Cookies

Please check :
<a  href="[https://github.com/bangtam1994/marvel-frontend-react](https://github.com/bangtam1994/marvel-frontend-react)">[https://github.com/bangtam1994/marvel-frontend-react](https://github.com/bangtam1994/marvel-frontend-react)</a>

## Deployment

- Client : deployed with Netlify

- Server : deployed with Heroku

- MongoDb database : hosted on Mlab

## Contact

<a  href="[https://www.linkedin.com/in/bangtamnguyen/](https://www.linkedin.com/in/bangtamnguyen/)"  target="_blank"> <img src="https://lh3.googleusercontent.com/proxy/_ykNtwIOihB2uh4y86nzq8FFoWoVuzB1cq6zcjdmlbhqJ0D5lb8Lmf1-VudVwF2jY9F3cRPd38LxbERFNshl5s7TntVTXCCeIYG0BhU" 
width="50"
/></a>
<a  href="mailto:bangtam1994@hotmail.com"  target="_blank"> <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png" 
width="40"
/></a>
