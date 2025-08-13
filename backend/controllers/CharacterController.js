const Character = require('../models/character');
const Contribution = require('../models/contribution');

exports.addCharacter = async (req, res) => {
    try {
        const { name } = req.body;
        const existingCharacter = await Character.findOne({ name });
        if (existingCharacter) {
            return res.status(409).json({ message: "Character with this name already exists." });
        }
        const newCharacter = new Character(req.body);
        await newCharacter.save();
        res.status(201).send("Character added successfully");
    } catch (error) {
        console.error("Failed to add character", error);
        res.status(500).send("character adding fail:" + error.message);
    }
};

exports.getCharacterById = async (req, res) => {
    try {
        const { id } = req.params;
        const character = await Character.findOne({ id });
        if (!character) {
            return res.status(404).json({ message: 'Character not found' });
        }
        res.json(character);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.editCharacter = async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;
        const updatedCharacter = await Character.findOneAndUpdate({ id }, update, { new: true });
        if (!updatedCharacter) {
            return res.status(404).json({ message: 'Character is not found' });
        }
        res.json(updatedCharacter);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllCharacters = async (req, res) => {
    try {
        const characters = await Character.find({ "active" : true });
        res.status(200).json(characters);
    } catch (error) {
        console.error("Failed to retrieve active characters ", error);
        res.status(500).json({ message: "Error retrieving active characters: " + error.message });
    }
};

exports.deactivateCharacter = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Character.updateOne(
            { id },
            { $set: { active: false } }
        );
        if (result.matchedCount === 0) {
            res.status(404).send("Character is not found");
        } else if (result.modifiedCount === 0) {
            res.status(204).send("No changes made to the character");
        } else {
            res.send("Character deactivated successfully");
        }
    } catch (error) {
        console.error("Failed to deactivate character", error);
        res.status(500).json({ message: "Error deactivating character: " + error.message });
    }
}