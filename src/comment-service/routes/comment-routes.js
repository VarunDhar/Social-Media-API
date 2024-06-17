const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment-controller');
const authMiddleware = require('../../middlewares/authMiddleware');

//comment on discussion
router.post('/:id', [authMiddleware], commentController.commentOnDiscussion);
//Update a comment
router.patch('/:id/:commentId', authMiddleware, commentController.updateComment);
//Delete a comment
router.delete('/:id/:commentId', authMiddleware, commentController.deleteComment);
//Like a comment
router.patch('/:id/:commentId/like', authMiddleware, commentController.likeComment);
//Reply to a comment
router.post('/:id/:commentId/reply', authMiddleware, commentController.replyToComment);
//Like a reply
router.post('/:id/:commentId/reply/:replyId/like', authMiddleware, commentController.likeReply);

module.exports = router;