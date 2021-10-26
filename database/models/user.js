// Libraries
const mongoose = require('mongoose');

// User Schema
const UserSchema = mongoose.model('users', new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
}, { versionKey: false }));

// Export
module.exports = UserSchema;