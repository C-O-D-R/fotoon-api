// ----------------------------------------------------------------
// Imports
// ----------------------------------------------------------------
// DOTENV
import { config } from 'dotenv';
config();

// Express
import express from 'express';

// Bcrypt
import bcrypt from 'bcryptjs';

// Json Web Token
import jwt from 'jsonwebtoken';

// User Schema
import UserSchema from '../models/UserSchema.js';


// --------------------------------------------------------------
// Router
// --------------------------------------------------------------
const Router = express.Router();
export default Router;


// --------------------------------------------------------------
// Routes
// --------------------------------------------------------------
// Login
Router.post('/', async (req, res) => {
    // Request Credentials
    const usernamePlain = req.body.username;
    const passwordPlain = req.body.password;

    // Request Database User
    const dbUser = await UserSchema.findOne({ username: usernamePlain }).lean();

    // Login
    try {
        if (dbUser && await bcrypt.compare(passwordPlain, dbUser.password)) {
            // JWT Token
            const token = jwt.sign({ id: dbUser._id , username: dbUser.username}, process.env.SERVER_JWT_SECRET);

            // General Success Authentication
            return res.status(200).json({ status: 'success', code: 'login_success', description: 'User authenticated successfully!', token: token });
        } else {
            // Password/Username/JWT Failed Authentication
            return res.status(401).json({ status: 'error', code: 'invalid_credentials', description: 'Invalid username or password!' });
        }
    } catch (error) {
        // Error Failed Authentication
        terminal.error(`[SERVER] Failed at login: ${error}`);
        return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error: ${error}`});
    }
});