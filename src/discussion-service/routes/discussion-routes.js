const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussion-controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });
const authMiddlewareForServices = require("../../middlewares/authMiddlewareForServices");
//Create Discussion
router.post('/', [authMiddleware, upload.single('image')],discussionController.createDiscussion);
//Get all discussions
router.get('/', authMiddleware, discussionController.getAllDiscussions);//
//Search for a discussion, using tag or text
router.get('/search', authMiddleware, discussionController.searchDiscussions);//
//Update text for a discussion
router.patch('/:id', authMiddleware, discussionController.updateDiscussion);//
//Delete a discussion
router.delete('/:id', authMiddleware, discussionController.deleteDiscussion);//
//Like/Unlike a discussion
router.patch('/:id/like', authMiddleware, discussionController.likeDiscussion);

/* Routes for inter-service API requests */
//Find one discussion
router.get('/:id/:token',authMiddlewareForServices,discussionController.findOne);
//update one discussion
router.patch('/:id/:token',authMiddlewareForServices,discussionController.updateOne);

module.exports = router;
