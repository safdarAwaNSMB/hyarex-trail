const express = require('express');
const router = express.Router();
const wishListController = require('../controllers/wishListController');

router.post('/toggle-to-list', wishListController.toggleToList);
router.post('/check-favorite', wishListController.checkFavorite);
router.post('/delete-from-wishlist', wishListController.removeFavorite);
router.get('/get-user-wishList/:userid', wishListController.getFavorites);

module.exports = router;


