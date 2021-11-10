// ----------------------------------------------------------------
// Imports
// ----------------------------------------------------------------
// Express
import express from 'express';

// Bcrypt
import bcrypt from 'bcryptjs';

// User Schema
import UserSchema from '../models/UserSchema.js';


// --------------------------------------------------------------
// Router
// --------------------------------------------------------------
const Router = express.Router();
export default Router;


// ----------------------------------------------------------------
// Routes
// ----------------------------------------------------------------
// Register Main
Router.post('/', async (req, res) => {
    // Request Credentials
    const usernamePlain = req.body.username;
    const passwordPlain = req.body.password;

    // Checks
    if (!usernamePlain || typeof usernamePlain !== 'string') {
        return res.status(406).json({ status: 'error', code: 'invalid_username_type', description: 'Invalid username type!' });
    }

    if (!passwordPlain || typeof passwordPlain !== 'string') {
        return res.status(406).json({ status: 'error', code: 'invalid_password_type', description: 'Invalid password type!' });
    }

    if (passwordPlain.length < 8) {
        return res.status(406).json({ status: 'error', code: 'invalid_password_length', description: 'Invalid password length!' });
    }

    // Hashed Password
    const passwordHashed = await bcrypt.hash(passwordPlain, 10);

    // Update Database
    try {
        // Create User
        await UserSchema.create({
            username: usernamePlain,
            password: passwordHashed
        })

        // General Success Registration
        return res.status(200).json({ status: 'success', code: 'registration_success', description: 'User registered successfully!' });
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate Username Failed Registration
            return res.status(406).json({ status: 'error', code: 'username_exists', description: 'Username already exists!' });
        } else {
            // Error Failed Registration
            terminal.error(`[SERVER] Failed at register: ${error}`);
            return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error: ${error}` });
        }
    }
});