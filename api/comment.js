// ----------------------------------------------------------------
// Imports
// ----------------------------------------------------------------
// DOTENV
import { config } from 'dotenv';
config();

// Express
import express from 'express';

// Comment Schema
import CommentSchema from '../models/CommentSchema.js';


// --------------------------------------------------------------
// Router
// --------------------------------------------------------------
// Export Router
const Router = express.Router();
export default Router;


// -------------------------------------------------------------
// Routes
// -------------------------------------------------------------
// GET api.fotoon.app/comment/{commentId}
// POST api.fotoon.app/comment

// GET Comment by Comment ID
Router.get('/:id', async (req, res) => {
    // Variables
    var commentId = req.params.id

    // Database Variables
    var dbComment;

    // Database Comment
    try {
        dbComment = await CommentSchema.findOne({ _id: commentId }).lean();
        if (!dbComment) return res.status(404).json({ status: 'error', code: 'comment_not_found', description: 'Specified comment was not found!' });

        // Return Comment
        return res.send(200).json({ status: 'success', code: 'comment_found', description: 'Comment has been found!', data: { dbComment } });
    } catch (error) {
        // Failed GET Comment
        terminal.error(`[SERVER] Failed at comment: ${error}`);
        return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error ${error}` });
    }
});

// POST Comment
Router.post('/', authUser, async (req, res) => {
    // Variables
    var postId = req.body.postId;
    var userId = req.body.userId;
    var text = req.body.text;

    // Checks
    if (text.length > 150) return res.status(406).json({ status: 'error', code: 'invalid_text_length', description: 'Text has to be less than 150 characters' });

    // Create Post
    try {
        await CommentSchema.create({
            postId: postId,
            userId: userId,
            text: text
        });

        return res.status(200).json({ status: 'success', code: 'comment_created_successfully', description: 'Comment has been created!' });
    } catch (error) {
        // Failed POST Comment
        terminal.error(`[SERVER] Failed at comment: ${error}`);
        return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error ${error}` });
    }
});


// --------------------------------------------------------------
// Documentation
// --------------------------------------------------------------
