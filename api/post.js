// -------------------------------------------------------------
// Imports
// -------------------------------------------------------------
// Express
import express from 'express';

// Post Schema Schema
import PostSchema from '../models/PostSchema.js';

// File Stream
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
// GET api.fotoon.app/post/{postId}
// GET api.fotoon.app/posts
// POST api.fotoon.app/post

// GET Post by ID
Router.get('/post/:id', async (req, res) => {
    // Variables
    var postId = req.params.id;

    // Get Data
    try {
        var dbPost = await PostSchema.findOne({ _id: postId }).lean();

        if (!dbPost) return res.status(404).json({ status: 'error', code: 'not_found', description: 'Requested post was not found' });
        return res.status(200).json({ status: 'success', code: 'get_posts_success', description: 'Post retrieved', data: dbPost });
    } catch (error) {
        // Failed GET Post
        terminal.error(`[SERVER] Failed at post: ${error}`);
        return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error ${error}` });
    }
});

// GET Post by Owner IDs
Router.get('/posts', async (req, res) => {
    // Variables
    var userIds = req.body.ids;

    // Data Array
    var data = [];

    // Get Data
    try {
        for (var i = 0; i < userIds.length; i++) {
            var userId = userIds[i];
            var posts = await PostSchema.find({ ownerId: userId }).lean();

            for (var j = 0; j < posts.length; j++) {
                var post = posts[j];
                data.push(post);
            }
        }

        // Success
        return res.status(200).json({ status: 'success', code: 'get_posts_success', description: 'Posts retrieved', data: data });
    } catch (error) {
        // Failed Post Data
        terminal.error(`[SERVER] Failed at post: ${error}`);
        return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error ${error}` });
    }
});

// POST a Post
Router.post('/post', authUser, async (req, res) => {
    // Global variables
    var userId = req.user.id;
    var image = req.body.image;
    var caption = req.body.caption;

    // Check
    if (caption.length > 100) {
        return res.status(406).json({ status: 'error', code: 'invalid_caption_length', description: 'Invalid Caption length, must be no more than 100 characters' });
    }

    // Creating Post
    try {
        await PostSchema.create({
            ownerId: userId,
            image: image,
            caption: caption
        });

        // Success
        return res.status(200).json({ status: 'success', code: 'post_success', description: 'Post created successfully' });

    } catch (error) {
        // Failed Post Data
        terminal.error(`[SERVER] Failed at user: ${error}`);
        return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error ${error}` });
    }

});


/**
 * @swagger
 * /post/{postId}:
 *  get:
 *      summary: Gaunamas įrašas
 *      description: Gaunamas įrašas pagal jo ID
 *      tags:
 *          - post
 *      responses:
 *          '200':
 *              summary: Sėkmingai gautas įrašas
 *              description:
 *      
 * /posts:
 *  get:
 *      summary: Gaunami įrašai
 *      description: Pagal pateiktus varotojų ID's, gaunami visi su šiais ID's susiję įrašai
 *      tags:
 *          - post
 *      requestBody:
 *          required: true,
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          ids:
 *                              type: array
 *                              items:
 *                                  type: string
 *                                  example: <user ID>
 *          
 *      responses:
 *          '200':
 *              summary: Sėkmingai gauti įrašai
 *              description: Sėkmingai gauti įrašai, pagal pateiktus ID's
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetPostsSuccess'
 * /post:
 *  post:
 *      summary: Kurti įrašas
 *      description: Sukuriamas įrašas MongoDB duomenų bazėje
 *      tags:
 *          - post
 *      responses:
 *          '200':
 *              summarry: Sekmingai sukurtas įrašas
 *              description: Sekmingai sukurtas įrašas
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PostSuccess'
 *      
 *          '500':
 *              summary: Serverio klaida
 *              description: API klaida, galimas sutrikimas duomenų bazėje.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 * 
 * components:
 *  schemas:
 *      GetPostsSuccess:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: success
 *              code:
 *                  type: string
 *                  example: get_posts_success
 *              description:
 *                  type: string
 *                  example: Posts Gotten
 *              data:
 *                  type: array
 *                  items: 
 *                      type: object
 *                      properties:
 *                          ownerId:
 *                              type: string
 *                              example: <owner ID> 
 *                          image:
 *                              type: string
 *                              example: <image base64> 
 *                          caption:
 *                              type: string
 *                              example: <caption>
 *                          comments:
 *                              type: array
 *                              items:
 *                                  type: string
 *                                  example: <comment ID>
 *                          date:
 *                              type: string
 *                              example: <date> 
 *      PostSuccess:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: success
 *              code:
 *                  type: string
 *                  example: post_success
 *              description:
 *                  type: string
 *                  example: Post Created Successfully
 * 
 *      InternalError:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: error
 *              code:
 *                  type: string
 *                  example: server_error
 *              description:
 *                  type: string
 *                  example: Internal server error <error message>
 */