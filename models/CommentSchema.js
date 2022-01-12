// Mongoose
import mongoose from 'mongoose';

//CommentSchema
export default mongoose.model('CommentSchema', new mongoose.Schema({
    postId: { type: String, required: true },
    userID: { type: String, required: true },
    text: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now }
}, { versionKey: false, collection: 'comments' }));