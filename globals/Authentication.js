// -------------------------------------------------------------
// Imports
// -------------------------------------------------------------
// DOTENV
import { config } from 'dotenv';
config();

// JSON Web Token
import jwt from 'jsonwebtoken';

// User Schema
import UserSchema from '../models/UserSchema.js';


// -------------------------------------------------------------
// Globals
// -------------------------------------------------------------
// API Key Authentication
global.authKey = async function (req, res, next) {
    // Variables
    const key = req.body.key;

    // Request Database User
    const dbUser = await UserSchema.findOne({ developerKeys: key }).lean();

    // Checks
    if (!dbUser) {
        return res.status(401).json({ status: 'error', code: 'user_unauthorized', description: 'No developer found with this API key!' });
    } else {
        req['user'] = { id: dbUser._id };
        next();
    }
}

// User Password Authentication
global.authUser = async function (req, res, next) {
    // Variables
    var userId;

    // Request Token
    const token = req.body.data.token;


    // Token Validation
    try {
        var user = jwt.verify(token, process.env.SERVER_JWT_SECRET);
        userId = user.id;
    } catch (error) {
        return res.status(401).json({ status: 'error', code: 'invalid_token', description: 'Invalid token!' });
    }
    
    req['user'] = { id: userId };

    next();
}