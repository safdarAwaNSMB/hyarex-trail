const express = require('express');
const cors = require('cors');
const CreateUsersTable = require('./src/tables/usersTable');
const userRoutes = require('./src/routes/userRoutes');
const wishlistRoutes = require('./src/routes/wishlist');
const { CreateWishListsTable } = require('./src/tables/wishlists');


const app = express();
require('./src/Database/db');
app.use(cors());
// Automatically parse incoming JSON to an object so we can access it in our request handlers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// const axios = require('axios');

// const options = {
//     method: 'GET',
//     url: 'https://demo-project73536.p.rapidapi.com/catalog/category/category/products',
//     params: {limit: '', skip: ''},
//     headers: {
//       'X-RapidAPI-Key': '1013c5ec66msh372a762a07eeb8fp1803b5jsna65e28c27f18',
//       'X-RapidAPI-Host': 'demo-project73536.p.rapidapi.com'
//     }
//   };

// const check = async () => {
//     try {
//         axios.request(options).then(function (response) {
//             console.log(response.data);
//         }).catch(function (error) {
//             console.error(error);
//         });
//     } catch (error) {
//         console.error(error);
//     }
// }

// check();



// Set CORS headers manually
// Add middleware to set CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, DELETE, POST, PUT');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
CreateUsersTable();
CreateWishListsTable();

app.use(userRoutes)
app.use(wishlistRoutes)



app.listen(4000, () => {
    console.log('Server running on 4000');
})