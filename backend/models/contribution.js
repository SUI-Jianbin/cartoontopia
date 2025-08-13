// contributions model
const mongoose = require('mongoose');

const objectIdRefSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const contributioSchema = new mongoose.Schema({
    contribution_id: {
        type: String,
        required: true,
    },

    user_id: objectIdRefSchema,

    action: {
        type: String,
        required: true,
        default: "AddCharacter"
    },

    status: {
        type: String,
        default: "Approved"
    },

    reviewed_by: objectIdRefSchema,

    date: {
        type: Date,
        default: Date.now
    },

    data: {
        type: Object,
        default: null
    }
});

const Contribution = mongoose.model('contribution', contributioSchema, 'contributions');
module.exports = Contribution;