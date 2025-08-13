// user routes
const express = require('express');
const userController = require('../controllers/UserController');
const router = express.Router();

router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/userprofile', userController.getFavourCharacters);
router.get('/getallusers', userController.getAllUsers);
router.get('/getalladmins', userController.getAllAdmins);
router.put('/updateRole/:userId', userController.updateUserRole);
router.get('/getuserName/:id', userController.getUserById);

module.exports = router;