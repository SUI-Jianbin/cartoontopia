const express = require('express');
const router = express.Router();
const favouriteController = require('../controllers/FavouriteController');

router.put('/updateFavourite/:user_id', favouriteController.updateFavourite);
router.get('/getFavouritesByUser/:user_id', favouriteController.getFavouritesByUser);
router.get('/getFavouritesByUserId/:user_id', favouriteController.getFavouritesByUserId);

module.exports = router;