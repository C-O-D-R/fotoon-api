// Libraries
const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { collection: 'users', versionKey: false });

// Export
const model = mongoose.model('UserSchema', UserSchema);
module.exports = model;