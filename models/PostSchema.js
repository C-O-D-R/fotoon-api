// Mongoose
import mongoose from 'mongoose';

//Post Schema
export default mongoose.model('PostSchema', new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
    postImage: { type: String, required: true },
    caption: { type: String, trim: true, required: false },
    comments: [{ type: mongoose.Schema.Types.ObjectId }],
    date: { type: Date, default: Date.now }
}, { versionkey: false, colection: 'posts' }));