// Libraries
const mongoose = require('mongoose');
require('dotenv').config();

// Connection
module.exports = mongoose.connect(process.env.MONGO_SRV, { useNewUrlParser: true });