// ----------------------------------------------------------------
// Imports
// ----------------------------------------------------------------
// Express
import express from 'express';

// User Schema
import UserSchema from '../models/UserSchema.js';

// File Stream
import fs from 'fs';


// ----------------------------------------------------------------
// Router
// ----------------------------------------------------------------
// Export Router
const Router = express.Router();
export default Router;


// ----------------------------------------------------------------
// Routes
// ----------------------------------------------------------------
// Update
Router.patch('/update', authUser, async (req, res) => {
    // Global Variables
    const userId = req.user.id;

    // Update Variables
    const profilePicture = req.body.profilePicture == undefined ? null : req.body.profilePicture;

    // Request Database User
    const dbUser = await UserSchema.findOne({ _id: userId }).lean();

    // Update
    try {
        // Update
        await UserSchema.findOneAndUpdate({ _id: userId }, {
            $set: { profilePicture: profilePicture }
        });
    } catch (error) {
        // Error Failed Update
        terminal.error(`[SERVER] Failed at user: ${error}`);
        return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error ${error}` });
    }
});

Router.get('/test/:id', async (req, res) => {
    // 1. Save ID
    const userId = req.params.id;

    // 2. Find User By ID in DB
    const dbUser = await UserSchema.findOne({ _id: userId }).lean();

    /// svarbu
    const buffer = await Buffer.from(dbUser.profilePicture, 'base64');
    console.log(buffer);
    fs.writeFileSync('image.jpg', buffer);
});

// Get user
Router.get('/:id', async (req, res) => {
    // Global variables
    const userId = req.params.id;

    // Checking for DB and User
    try {
        // Wrong ID Format
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ status: 'error', code: 'invalid_format', description: `Invalid format` });

        // Request Database User
        const dbUser = await UserSchema.findOne({ _id: userId }).lean();

        // User Not Found
        if (!dbUser) return res.status(404).json({ status: 'error', code: 'invalid_user', description: `User not found` });

        // Success User Data
        return res.status(200).json({ username: dbUser.username, profilePicture: dbUser.profilePicture });

    } catch (error) {
        // Failed User Data
        terminal.error(`[SERVER] Failed at user: ${error}`);
        return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error ${error}` });
    }
});
