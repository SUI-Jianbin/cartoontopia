const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    subtitle: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    image_url: {
        type: String,
    },

    strength: {
        type: Number,
        required: true
    },

    speed: {
        type: Number,
        required: true
    },

    skill: {
        type: Number,
        required: true
    },

    fear_factor: {
        type: Number,
        required: true
    },

    power: {
        type: Number,
        required: true
    },

    intelligence: {
        type: Number,
        required: true
    },

    wealth: {
        type: Number,
        required: true
    },

    active: {
        type: Boolean,
        default: false
    },
});

const Character = mongoose.model('character', characterSchema, 'characters');
module.exports = Character;