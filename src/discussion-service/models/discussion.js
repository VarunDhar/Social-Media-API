const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replies: [{
        text: { type: String, required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        createdOn: { type: Date, default: Date.now }
    }],
    createdOn: { type: Date, default: Date.now }
});

const DiscussionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    image: { type: String },
    hashtags: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdOn: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [CommentSchema],
    views: { type: Number, default: 0 }
});

module.exports = mongoose.model('Discussion', DiscussionSchema);
