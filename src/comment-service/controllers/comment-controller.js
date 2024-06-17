const {StatusCodes} = require("http-status-codes");
const {successResponse} = require("../../utils/common/");
require("dotenv").config();
const axios = require("axios");
const instance = axios.create({
    withCredentials: true,
  });

async function commentOnDiscussion(req, res){
    const { text } = req.body;
    try {
        let discussion;
        try {
            let {data} = await instance.get(`${process.env.DISCUSSION_URL}/${req.params.id}/${req.cookies.token}`);
            discussion = data;
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({error:error});
        }
        if (!discussion){
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Discussion not found' });
        }
        
        discussion.comments.push({ text, createdBy: req.user.id });
        try {
            let result = await instance.patch(`${process.env.DISCUSSION_URL}/${req.params.id}/${req.cookies.token}`,discussion);
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "message:": error });
        }
        successResponse.data = discussion;
        return res.status(StatusCodes.CREATED).json(successResponse);
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "message::": err });
    }
};

async function updateComment(req, res){
    const { text } = req.body;
    try {
        let discussion;
        try {
            let {data} = await instance.get(`${process.env.DISCUSSION_URL}/${req.params.id}/${req.cookies.token}`);
            discussion = data;
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({error:error});
        }

        discussion.comments.forEach(comment => {
            if(comment._id === req.params.commentId){
                comment.text = text;
            }
        });
        try {
            let result = await instance.patch(`${process.env.DISCUSSION_URL}/${req.params.id}/${req.cookies.token}`,discussion);
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "message:": error });
        }
        successResponse.data = discussion;
        return res.status(StatusCodes.OK).json(successResponse);
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

async function deleteComment(req, res){
    try {
        let discussion;
        try {
            let {data} = await instance.get(`${process.env.DISCUSSION_URL}/${req.params.id}/${req.cookies.token}`);
            discussion = data;
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({error:error});
        }

        const len = discussion.comments.length;
        const updatedComments = discussion.comments.filter((com)=>{
            return com._id != req.params.commentId;
        });
        if (len == updatedComments.length)
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Comment not found' });

        discussion.comments = updatedComments;
        try {
            let result = await instance.patch(`${process.env.DISCUSSION_URL}/${req.params.id}/${req.cookies.token}`,discussion);
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "message:": error });
        }
        successResponse.data = "Comment removed with id: "+req.params.commentId;
        return res.status(StatusCodes.OK).json(successResponse);
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

async function likeComment(req, res){
    try {
        
        let discussion;
        let {data} = await instance.get(`${process.env.DISCUSSION_URL}/${req.params.id}/${req.cookies.token}`);
        discussion = data;

        let isPresent = false;
        let newLikes;
        discussion.comments.forEach(comment => {
            if(comment._id === req.params.commentId){
                if (comment.likes.includes(req.user.id)) {
                    comment.likes.pull(req.user.id);
                } else {
                    comment.likes.push(req.user.id);
                }
                newLikes = comment.likes.length;
                isPresent = true;
            }
        });
        if (!isPresent) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Comment not found' });

        try {
            let result = await instance.patch(`${process.env.DISCUSSION_URL}/${req.params.id}/${req.cookies.token}`,discussion);
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "message:": error });
        }
        return res.json({ message: 'Comment like status updated: '+newLikes });
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

async function replyToComment(req, res){
    const { text } = req.body;
    try {
        let discussion;
        let {data} = await instance.get(`${process.env.DISCUSSION_URL}/${req.params.id}/${req.cookies.token}`);
        discussion = data;

        let isPresent = false;
        let len;
        discussion.comments.forEach(comment => {
            if(comment._id === req.params.commentId){
                comment.replies.push({ text, createdBy: req.user.id });
                isPresent = true;
                len = discussion.comments.length;
            }
        });
        if (!isPresent) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Comment not found' });

        try {
            let result = await instance.patch(`${process.env.DISCUSSION_URL}/${req.params.id}/${req.cookies.token}`,discussion);
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "message:": error });
        }

        return res.status(StatusCodes.CREATED).json({message:text});
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

async function likeReply(req, res){
    try {
        let discussion;
        let {data} = await instance.get(`${process.env.DISCUSSION_URL}/${req.params.id}/${req.cookies.token}`);
        discussion = data;

        let isPresent = false;
        let len;
        discussion.comments.forEach(comment => {
            if(comment._id === req.params.commentId){
                comment.replies.forEach(reply=>{
                    if(reply._id == req.params.replyId && reply.likes.includes(req.user.id)){
                        reply.likes.pull(req.user.id);
                    }
                    else if(reply._id == req.params.replyId){
                        reply.likes.push(req.user.id);
                    }
                    isPresent = true;
                    len = reply.likes.length;
                })
                
            }
        });
        if (!isPresent) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Reply not found' });

        try {
            let result = await instance.patch(`${process.env.DISCUSSION_URL}/${req.params.id}/${req.cookies.token}`,discussion);
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "message:": error });
        }

        return res.json({ message: 'Reply like status updated: '+len });
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
}
module.exports = {
    deleteComment,
    updateComment,
    commentOnDiscussion,
    likeComment,
    replyToComment,
    likeReply
};