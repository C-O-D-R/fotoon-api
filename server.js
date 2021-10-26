// Libraries
const express = require('express');
require('dotenv').config();

// Modules
const terminal = require('./utils/terminal.js');
const database = require('./database/connect.js');

// Server
const server = express();

// Database
database.then(() => terminal.log('Connection to MongoDB established!'));

// Route Imports
const loginRoute = require('./routes/login.js'); // Login
const registerRoute = require('./routes/register'); // Regsiter

// Route Definitions
server.use('/login', loginRoute); // Login
server.use('/register', registerRoute); // Register

// Port
server.listen(process.env.PORT); // Port:3000