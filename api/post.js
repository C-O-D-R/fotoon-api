// -------------------------------------------------------------
// Imports
// -------------------------------------------------------------
// Express
import express from 'express';

// Post Schema Schema
import PostSchema from '../models/PostSchema.js';

//File Stream
import fs from 'fs';

// -------------------------------------------------------------
// Router
// -------------------------------------------------------------
// Export Router
const Router = express.Router();
export default Router;

// -------------------------------------------------------------
// Routes
// -------------------------------------------------------------
// Update
Router.get('/:postId', async (req, res) => {
    //Global Variables
    const postId = req.params.postId;


})
