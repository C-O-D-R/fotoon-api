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
// User Password Authentication
global.authUser = async function (req, res, next) {
    // Variables
    var userId;

    // Request Token
    const token = req.cookies.token;

    // Token Validation
    try {
        var user = jwt.verify(token, process.env.JWT_SECRET);
        userId = user.id;

        var dbUser = await UserSchema.findOne({ _id: userId }).lean();
        if (!dbUser) return res.status(401).json({ status: 'error', code: 'invalid_user', description: 'Invalid user!' });
        else {
            req['user'] = { id: userId };

            next();
        }
    } catch (error) {
        terminal.error(`[SERVER] Failed at authentication: ${error}`);
        return res.status(401).json({ status: 'error', code: 'invalid_token', description: 'Invalid token!' });
    }
}