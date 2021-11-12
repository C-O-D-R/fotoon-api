// -------------------------------------------------------------
// Imports
// -------------------------------------------------------------
// Express
import express from 'express';

// User Schema
import UserSchema from '../models/UserSchema.js';


// -------------------------------------------------------------
// Router
// -------------------------------------------------------------
const Router = express.Router();
export default Router;


// -------------------------------------------------------------
// Routes
// -------------------------------------------------------------
// Register API Key
Router.post('/register', authUser, async (req, res) => {
    // Variables
    const userId = req.user.id;
    var key;

    // Request Database User
    const dbUser = await UserSchema.findById(userId).lean();

    // Developer Check
    if (!dbUser.developerMode) return res.status(401).json({ status: 'error', code: 'user_unauthorized', description: 'User does not have developer mode on!' });

    // Key Generation and Database Update
    try {
        key = generateKey(20);
        await UserSchema.findByIdAndUpdate({ _id: userId }, {
            $push: { developerKeys: key }
        });
    } catch (error) {
        // Error Failed Generation
        terminal.error(`[SERVER] Failed at /dev/register: $${error}`);
        return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error ${error}` });
    }

    // Key Generation Success
    return res.status(200).json({ status: 'success', code: 'key_regsitered', description: 'API key has been registered!', key: key });
});


// -------------------------------------------------------------
// Helper Functions
// -------------------------------------------------------------
function generateKey(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


// -------------------------------------------------------------
// Documentation
// ------------------------------------------------------------------------------------------------------------