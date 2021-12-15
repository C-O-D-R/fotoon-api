// ----------------------------------------------------------------
// Imports
// ----------------------------------------------------------------
// Globals
import './globals/Terminal.js';
import './globals/Authentication.js';

// DOTENV
import { config } from 'dotenv';
config();

// HTTP & HTTPS
import http from 'http';
import https from 'https';

// Express
import express from 'express';

// Mongoose
import mongoose from 'mongoose';

// Body Parser
import bodyParser from 'body-parser';

// Swagger JsDoc
import swaggerJsDoc from 'swagger-jsdoc';

// Swagger Express UI
import swaggerUI from 'swagger-ui-express';

// File Stream
import fs from 'fs';


// ----------------------------------------------------------------
// Global Variables
// ----------------------------------------------------------------
// MongoDB SRV
const mongoSrv = process.env.MONGO_SRV;

// Swagger Options
const swaggerDocsOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Fotoon API',
            version: '0.0.2',
            description: 'Fotoon API sukurtas KA projektui.',

            servers: [{
                url: 'https://api.fotoon.app',
                description: 'Pagrindinis API serveris.'
            }]
        }
    },
    apis: ['server.js', './api/login.js', './api/register.js', './api/user.js'],

}

const swaggerUiOptions = {
    customCssUrl: './static/swagger.css',
    customJs: './static/swagger.js',
    swaggerOptions: { 
        defaultModelsExpandDepth: -1
    }
}


// ----------------------------------------------------------------
// Main Code
// ----------------------------------------------------------------
// Database
mongoose.connect(mongoSrv, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => terminal.info('[MONGODB] Connection established!'));

// Swagger
const swaggerDoc = swaggerJsDoc(swaggerDocsOptions);

// Server
const Server = express();
Server.use('/docs/static', express.static('public'));
Server.use(bodyParser.json());
Server.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc, swaggerUiOptions));

// Root API ENDPOINT
Server.get('/', (req, res) => {
    res.send('Root API endpoint');
});

// API
// Route Imports
import dev from './api/dev.js'; // Import Dev Routes
import login from './api/login.js'; // Import Login
import register from './api/register.js'; // Import Register
import user from './api/user.js'; // Import User
import post from './api/post.js'; // Import Post

// Route Uses
Server.use('/dev', dev); // Use Dev Routes
Server.use('/login', login); // Use Login
Server.use('/register', register); // Use Register
Server.use('/user', user); // Use Register
Server.use('/post', post); // Use post

// HTTPS Server
if (process.env.DEV_MODE == 'true') {
    // Port
    const port = process.env.HTTPS_PORT || 80;

    // Development Server
    const ServerDevelopment = http.createServer(Server);
    ServerDevelopment.listen(port, () => {
        terminal.info(`[SERVER] Connection established and listening on port: ${port}!`);
        terminal.warn(`[SERVER] Running on insecure (development) mode!`);
    });
} else {
    // SSL Keys
    var privateKey;
    var certificate;
    var chain;
    var credentials;

    // SSL Key Loading
    try {
        // Try To Load SSL Keys
        privateKey = fs.readFileSync(process.env.SSL_PRIVATE_KEY, 'utf8');
        certificate = fs.readFileSync(process.env.SSL_CERTIFICATE, 'utf8');
        chain = fs.readFileSync(process.env.SSL_CHAIN, 'utf8');

        // Save Credentials
        credentials = { key: privateKey, cert: certificate, ca: chain };
    } catch (error) {
        // Bad/No SSL Keys Path
        terminal.error('[SERVER] Failed to load SSL keys!');
    }

    // Port 
    const port = process.env.HTTPS_PORT || 443;

    // Secure Server
    const ServerSecure = https.createServer(credentials, Server);
    ServerSecure.listen(port, () => {
        terminal.info(`[SERVER] Connection established and listening on port: ${port}!`);
    });
}