// Libraries
const mongoose = require('mongoose');

//Importing comment schema
const Comment = require('./comment');

//Post Schema
const PostSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    //title: {type: String, trim: true, required: true},
    caption: {type: String, trim: true, required: true},
    data: {type: Date, default: Date.now},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
},  {collection:'Post', versionkey: false });

// Export
const model = mongoose.model('PostSchema', PostSchema);
module.exports = model;