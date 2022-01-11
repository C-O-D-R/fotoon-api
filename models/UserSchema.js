// Mongoose
import mongoose from 'mongoose';

// User Schema
export default mongoose.model('UserSchema', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, required: false },
    shortBio: { type: String, required: false },
    longBio: { type: String, required: false },
    following: { type: Array, required: false },
    followers: { type: Array, required: false }
}, { versionKey: false, collection: 'users' }));