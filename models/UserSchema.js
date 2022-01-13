// Mongoose
import mongoose from 'mongoose';

// User Schema
export default mongoose.model('UserSchema', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, required: true, default: ' ' },
    shortBio: { type: String, required: true, default: ' ' },
    longBio: { type: String, required: true, default: ' ' },
    following: { type: Array, required: true, default: [] },
    followers: { type: Array, required: true, default: [] }
}, { versionKey: false, collection: 'users' }));