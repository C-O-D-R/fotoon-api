// Mongoose
import mongoose from 'mongoose';

//Post Schema
export default mongoose.model('PostSchema', new mongoose.Schema({
    ownerId: { type: String, required: true },
    image: { type: String, required: true },
    caption: { type: String, required: true },
    comments: { type: Array, required: true, default: [] },
    date: { type: Date, required: true, default: Date.now }
}, { versionkey: false, collection: 'posts' }));