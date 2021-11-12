// Mongoose
import mongoose from 'mongoose';

// User Schema
export default mongoose.model('UserSchema', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    developerMode: { type: Boolean, required: true, default: false },
    developerKeys: { type: Array, required: true, default: [] }
}, { versionKey: false, collection: 'users' }));