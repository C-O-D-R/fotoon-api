// Libraries
const mongoose = require('mongoose');

// Comment Schema
const CommentSchema = new mongoose.Schema({
    text: {type: String, trim: false, required: true},
    date: {type: Date, default: Date.now}
}, { collection: 'comment', versionKey: false });

// Export
const model = mongoose.model('CommentSchema', CommentSchema);
module.exports = model;