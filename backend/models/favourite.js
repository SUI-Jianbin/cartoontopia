const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
    user_id: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    characters: [{
        type: String,
        required: true,
    }]
});

const Favourite = mongoose.model('favourites', favouriteSchema, 'favourites');
module.exports = Favourite;