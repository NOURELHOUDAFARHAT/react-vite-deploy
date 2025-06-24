const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    msg:String,
    time:String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    activity: { type: mongoose.Schema.Types.ObjectId, ref: 'activities' }

}, { collection: 'Comment' });

const CommentModel = mongoose.model("Comment", CommentSchema);
module.exports = CommentModel;