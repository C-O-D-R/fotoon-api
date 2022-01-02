// Mongoose
import mongoose from 'mongoose';

//CommentSchema
export default mongoose.model('CommentSchema', new mongoose.Schema({
    postId: {type: mongoose.Schema.Types.ObjectId, required: true},
    userID: {type: mongoose.Schema.Types.ObjectId, required: true},
    text: {type: String, trim: true, required: true},
    date: {type: Date, default: Date.now}
}, {versionkey: false, collection: 'comments'}));