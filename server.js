// ----------------------------------------------------------------
// Imports
// ----------------------------------------------------------------
// Globals
import './globals/Terminal.js';

// DOTENV
import { config } from 'dotenv';
config();

// Express
import express from 'express';

// Mongoose
import mongoose from 'mongoose';

// Body Parser
import bodyParser from 'body-parser';


// ----------------------------------------------------------------
// Global Variables
// ----------------------------------------------------------------
// SSL Keys
const privateKey = process.env.SSL_PRIVATE_KEY;
const certificate = process.env.SSL_CERTIFICATE;
const chain = process.env.SSL_CHAIN;
const credentials = { key: privateKey, cert: certificate, ca: chain };

// MongoDB SRV
const mongoSrv = process.env.MONGO_SRV;


// ----------------------------------------------------------------
// Main Code
// ----------------------------------------------------------------
// Database
mongoose.connect(mongoSrv, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => terminal.info('[MONGODB] Connection established!'));

// HTTP & HTTPS
import http from 'http';
import https from 'https';

// Server
const Server = express();
Server.use(bodyParser.json());

Server.get('/', (req, res) => {
    res.send('Root API endpoint');
});

// API
import login from './api/login.js'; // Import Login
import register from './api/register.js'; // Import Register

Server.use('/login', login); // Use Login
Server.use('/register', register); // Use Register

// HTTPS Server
if (process.env.DEV_MODE == 'true') {
    const port = process.env.HTTPS_PORT || 80;
    const ServerDevelopment = http.createServer(Server);
    ServerDevelopment.listen(port, () => {
        terminal.info(`[SERVER] Connection established and listening on port: ${port}!`);
        terminal.warn(`[SERVER] Running on insecure (development) mode!`);
    });
} else {
    const port = process.env.HTTPS_PORT || 443;
    const ServerSecure = https.createServer(credentials, Server);
    ServerSecure.listen(port, () => {
        terminal.info(`[SERVER] Connection established and listening on port: ${port}!`);
    });
}