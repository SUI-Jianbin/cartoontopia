// characters routes
const express = require('express');
const router = express.Router();
const characterController = require('../controllers/CharacterController');

router.post('/addcharacters', characterController.addCharacter);
router.get('/editcharacters/:id', characterController.getCharacterById);
router.put('/editcharacters/:id', characterController.editCharacter);
router.get('/getallcharacters', characterController.getAllCharacters);
router.put('/deactivatecharacter/:id', characterController.deactivateCharacter);
router.get('/characterdetail/:id', characterController.getCharacterById);

module.exports = router;