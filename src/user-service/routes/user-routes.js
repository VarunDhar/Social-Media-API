const express = require('express');
const router = express.Router();
const userController = require("../controllers/user-controller");
const authMiddleware = require('../../middlewares/authMiddleware');

//Signup user
router.post('/signup', userController.signup);
//Login user
router.post('/login', userController.login);
//Get all users
router.get('/', authMiddleware, userController.getAllUsers);
//Get a user by name
router.get('/search', authMiddleware, userController.getUserByName);
//Update a user
router.put('/:id', authMiddleware, userController.updateUser);
//Delete a user
router.delete('/:id', authMiddleware, userController.deleteUser);
//follow a user
router.post('/follow/:id', authMiddleware, userController.followUser);

module.exports = router;
