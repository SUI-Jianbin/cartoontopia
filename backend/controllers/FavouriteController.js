const Favourite = require('../models/favourite');

// update the favourite list
exports.updateFavourite = async (req, res) => {
    const { user_id } = req.params;
    const { character, action } = req.body;

    try {
        let update;

        if (action === 'add') {
            update = { $addToSet: { characters: character } }; // avoiding add repeatedly
        } else {
            update = { $pull: { characters: character } }; // delete the specific element
        }

        const updatedFavourite = await Favourite.findOneAndUpdate(
            { 'user_id._id': user_id },
            update,
            { new: true }
        );

        if (!updatedFavourite) {
            return res.status(404).send('User not found or update failed');
        }

        res.json(updatedFavourite);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFavouritesByUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        let favourite = await Favourite.find({ "user_id._id": user_id });

        if (favourite.length === 0) {
            favourite = new Favourite({
                user_id: { _id: user_id },
                characters: []
            });
            await favourite.save();
        }

        if(favourite.length === 0){
            res.json(favourite);
        }else{
            res.json(favourite[0].characters);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFavouritesByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;
        let favourite = await Favourite.find({ "user_id._id": user_id });
        if(favourite.length === 0){
            res.json(favourite);
        }else{
            res.json(favourite[0].characters);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};