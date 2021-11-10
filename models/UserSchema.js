// Mongoose
import mongoose from 'mongoose';

// User Schema
export default mongoose.model('UserSchema', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { versionKey: false, collection: 'users' }));