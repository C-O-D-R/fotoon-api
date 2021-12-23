// Mongoose
import mongoose from 'mongoose';

//CommentSchema
export default mongoose.model('CommentSchema', new mongoose.Schema({
    text: {type: String, trim: true, required: true},
    date: {type: Date, default: Date.now}
}, {versionkey: false, collection: 'comments'}));