// Mongoose
import mongoose from 'mongoose';

// User Schema
export default mongoose.model('UserSchema', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, required: false },
    bio: { type: String, required: false},
    following: { type: Array, required: false}
}, { versionKey: false, collection: 'users' }));