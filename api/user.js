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

Router.get('/test', authUser, async (req, res) => {
    // Global Variables
    const userId = req.user.id;

    // Request Database User
    const dbUser = await UserSchema.findOne({ _id: userId }).lean();
    const buffer = await Buffer.from(dbUser.profilePicture, 'base64');
    console.log(buffer);
    fs.writeFileSync('image.jpg', buffer);
});