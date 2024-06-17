
const {StatusCodes} = require("http-status-codes");
const successResponse = require("../../utils/common/success-response");
const Discussion = require('../models/discussion');
const {imageUploader} = require("../../utils/imageUploader");
require("dotenv").config();

async function createDiscussion(req, res){
    
    try {
        // console.log(req.body);
        const { text, hashtags } = req.body;
        if(!text){
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Text field cannot be empty" });
        }
        const splitHashtags = hashtags!=null?hashtags.split(','):null;
        // const image = req.files!=null?req.files.image:null;
        // let imageUpload = null;
        // if(image){
        //     imageUpload = await imageUploader(image,process.env.UPLOAD_FOLDER);
        // }
        let imageUrl = null;

        // console.log(imageUploader);
        if (req.file) {
            // console.log(req.file,req.body);
            const result = await imageUploader(req.file,process.env.UPLOAD_FOLDER);
            imageUrl = result.secure_url;
        }
        // console.log(req.user);
        const discussion = new Discussion({ text, hashtags:splitHashtags, image:imageUrl, createdBy: req.user.id });
        await discussion.save();

        successResponse.data = discussion;
        return res.status(StatusCodes.CREATED).json(successResponse);
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

async function getAllDiscussions(req, res){
    try {
        const discussions = await Discussion.find().populate('createdBy', 'name');
        successResponse.data = discussions;
        return res.status(StatusCodes.CREATED).json(successResponse);
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

async function searchDiscussions(req, res){
    const { text, tags } = req.query;
    try {
        const query = {};
        if (text) query.text = new RegExp(text, 'i');
        if (tags) query.hashtags = { $in: tags.split(',') };
        const discussions = await Discussion.find(query);
        successResponse.data = discussions;
        return res.status(StatusCodes.OK).json(successResponse);
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

async function getDiscussionById(req, res){
    try {
        const discussion = await Discussion.findById(req.params.id).populate('createdBy', 'name');
        if (!discussion)
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Discussion not found' });
        discussion.views += 1;
        await discussion.save();
        successResponse.data = discussion;
        return res.status(StatusCodes.OK).json(successResponse);
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

async function updateDiscussion(req, res){
    try {
        const discussion = await Discussion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!discussion)
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Discussion not found' });
        successResponse.data = discussion;
        return res.status(StatusCodes.OK).json(successResponse);
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

async function deleteDiscussion(req, res){
    try {
        const discussion = await Discussion.findByIdAndDelete(req.params.id);
        if (!discussion) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Discussion not found' });
        return res.status(StatusCodes.OK).json({ message: 'Discussion deleted successfully' });
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

async function likeDiscussion(req, res){
    try {
        const discussion = await Discussion.findById(req.params.id);
        if (!discussion) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Discussion not found' });

        if (discussion.likes.includes(req.user.id)) {
            discussion.likes.pull(req.user.id);
        } else {
            discussion.likes.push(req.user.id);
        }

        await discussion.save();
        successResponse.data = "Likes Updated: "+discussion.likes.length;
        return res.status(StatusCodes.OK).json(successResponse);
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

async function findOne(req,res){
    try {
        const result = await Discussion.findById(req.params.id);
        return res.status(StatusCodes.OK).json(result); 
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({"error-message":error.message});
    }
}

async function updateOne(req,res){
    try {
        const discussion = await Discussion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!discussion)
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Discussion not found' });
        successResponse.data = discussion;
        return res.status(StatusCodes.OK).json("Updated discussion with comment.");
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    } 
}

module.exports = {
    createDiscussion,
    deleteDiscussion,
    getAllDiscussions,
    getDiscussionById,
    updateDiscussion,
    likeDiscussion,
    searchDiscussions,
    findOne,
    updateOne
};