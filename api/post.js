// -------------------------------------------------------------
// Imports
// -------------------------------------------------------------
// Express
import express from 'express';

// Mongoose
import mongoose from 'mongoose';

// Post Schema Schema
import PostSchema from '../models/PostSchema.js';

// User Schema
import UserSchema from '../models/UserSchema.js';


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
// POST api.fotoon.app/post
// POST api.fotoon.app/post
// DELETE api.fotoon.app/post/${postId}

// GET Post by ID
Router.get('/:id', async (req, res) => {
    // Variables
    var postId = req.params.id;

    // Id format check
    if (!mongoose.isValidObjectId(postId)) return res.status(406).json({ status: 'error', code: 'invalid_format', description:"Id format is not acceptable!"});

    // Get Data
    try {
        var dbPost = await PostSchema.findOne({ _id: postId }).lean();

        if (!dbPost) return res.status(404).json({ status: 'error', code: 'not_found', description: 'Requested post was not found' });
        return res.status(200).json({ status: 'success', code: 'get_posts_success', description: 'Posts retrieved', data: dbPost });
    } catch (error) {
        // Failed GET Post
        terminal.error(`[SERVER] Failed at post: ${error}`);
        return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error ${error}` });
    }
});

// GET All Followed Posts
Router.post('/follows', authUser, async (req, res) => {
    // Database User
    var dbUser = await UserSchema.findOne({ _id: req.user.id }).lean();

    // Data Array
    var data = [];

    // Get Data
    try {
        for (var i = 0; i < dbUser.following.length; i++) {
            var userId = dbUser.following[i];
            var dbPosts = await PostSchema.find({ ownerId: userId }).lean();

            if (!dbPosts) continue;

            for (var j = 0; j < dbPosts.length; j++) {
                var post = dbPosts[j];
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

// GET All Owned Posts
Router.post('/owned', authUser, async (req, res) => {
    // Database User
    var dbPosts = await PostSchema.find({ ownerId: req.user.id }).lean();

    // Data Array
    var data = [];

    // Get Data
    try {
        for (var i = 0; i < dbPosts.length; i++) {
            var post = dbPosts[i];
            data.push(post);
        }

        // Success
        return res.status(200).json({ status: 'success', code: 'get_posts_success', description: 'Posts retrieved', data: data });
    } catch (error) {
        // Failed Post Data
        terminal.error(`[SERVER] Failed at post: ${error}`);
        return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error ${error}` });
    }
});

// PUT a Post
Router.put('/', authUser, async (req, res) => {
    // Global variables
    var userId = req.user.id;
    var image = req.body.image;
    var caption = req.body.caption == undefined ? ' ' : req.body.caption;

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

// DELETE Post by ID
Router.delete('/:id', authUser, async (req, res) => {
    // Variables
    var postId = req.params.id;

    // Id format check
    if (!mongoose.isValidObjectId(postId)) return res.status(406).json({ status: 'error', code: 'invalid_format', description:"Id format is not acceptable!"});

    // Get Data
    try {
        var dbUser = await UserSchema.findOne({ _id: req.user.id }).lean();
        var dbPost = await PostSchema.findOne({ _id: postId });

        if (dbUser._id != dbPost.ownerId) return res.status(401).json({ status: 'error', code: 'unauthorized', description: 'User is not authorized!' });
        await PostSchema.deleteOne({ _id: postId });

        return res.status(200).json({ status: 'success', code: 'delete_post_success', description: 'Post deleted' });
    } catch (error) {
        // Failed GET Post
        terminal.error(`[SERVER] Failed at post: ${error}`);
        return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error ${error}` });
    }
});


/**
 * @swagger
 * /post/{postId}:
 *  get:
 *      summary: Gaunamas ??ra??as
 *      description: Gaunamas ??ra??as pagal jo ID
 *      tags:
 *          - post
 *      responses:
 *          '406':
 *              summary: Neteisingas ID
 *              description: Pateiktas ID neteisingu formatu 
 *              content:
 *                  application/json: 
 *                      schema:
 *                          $ref: '#/components/schemas/InvalidIdFormat'
 *          '200':
 *              summary: S??kmingai gautas ??ra??as
 *              description: Pagal ID gr????inamas ??ra??as
 *              content:
 *                  application/json: 
 *                      schema:
 *                          $ref: '#/components/schemas/GetPostSuccess'
 *          '404':
 *              summary: ??ra??as nerastas
 *              description: Pagal ID n??ra ??ra??o
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PostNotFound'
 *          '500':
 *              summary: Serverio klaida
 *              description: API klaida, galimas sutrikimas duomen?? baz??je.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 *      
 * /post/:
 *  post:
 *      summary: Gaunami ??ra??ai
 *      description: Gaunami visi su autentifikuotu naudotoju susij?? ??ra??ai
 *      tags:
 *          - post
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          token:
 *                              type: string
 *                              example: <token>
 *      responses:
 *          '200':
 *              summary: S??kmingai gauti ??ra??ai
 *              description: S??kmingai gauti ??ra??ai, pagal pateiktus ID's
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetPostsSuccess'
 *          '500':
 *              summary: Serverio klaida
 *              description: API klaida, galimas sutrikimas duomen?? baz??je.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'             
 * /post:
 *  put:
 *      summary: Kurti ??ra????
 *      description: Sukuriamas ??ra??as MongoDB duomen?? baz??je
 *      tags:
 *          - post
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          token:
 *                              type: string
 *                              example: <token>
 *                          image:
 *                              type: string
 *                              example: <base64>
 *                          caption:
 *                              type: text
 *                              example: caption
 *      responses:
 *          '200':
 *              summarry: Sekmingai sukurtas ??ra??as
 *              description: Sekmingai sukurtas ??ra??as
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PostSuccess'
 *      
 *          '500':
 *              summary: Serverio klaida
 *              description: API klaida, galimas sutrikimas duomen?? baz??je.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 *          '406':
 *              summary: Neteisinga antra??t??
 *              description: Pateikta antra??t?? ilgesn?? nei 100 simboli??
 *              content:
 *                  application/json: 
 *                      schema:
 *                          $ref: '#/components/schemas/InvalidCaptionFormat'
 * /post/{postId}/:
 *  delete:
 *      summary: Naikinti ??ra????
 *      description: I?? duomen?? baz??s panaikinamas specifinis autentifikuoto varotojo nuotraukos ??ra??as
 *      tags:
 *          - post
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          token:
 *                              type: string
 *                              example: <token>
 *      responses:
 *          '200':
 *              summary: S??kmingai panaikintas ??ra??as
 *              description: S??kmingai panaikintas ??ra??as pagal pateikt?? ID
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/DeletePostSuccess'
 *          '500':
 *              summary: Serverio klaida
 *              description: API klaida, galimas sutrikimas duomen?? baz??je.
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
 *                  example: Posts retrieved
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
 *      GetPostSuccess:
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
 *                  example: Post retrieved
 *              data:
 *                  type: object
 *                  properties:
 *                      ownerId:
 *                          type: string
 *                          example: <owner ID> 
 *                      image:
 *                          type: string
 *                          example: <image base64> 
 *                      caption:
 *                          type: string
 *                          example: <caption>
 *                      comments:
 *                          type: array
 *                          items:
 *                              type: string
 *                              example: <comment ID>
 *                      date:
 *                          type: string
 *                          example: <date>
 * 
 *      DeletePostSuccess:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: success
 *              code:
 *                  type: string
 *                  example: delete_posts_success
 *              description:
 *                  type: string
 *                  example: Post deleted
 *      PostNotFound:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: error
 *              code:
 *                  type: string
 *                  example: not_found
 *              description:
 *                  type: string
 *                  example: Requested post was not found
 * 
 *      InvalidCaptionFormat:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: error
 *              code:
 *                  type: string
 *                  example: invalid_caption_length
 *              description:
 *                  type: string
 *                  example: Invalid Caption length, must be no more than 100 characters
 *  
 *      InvalidIdFormat:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: error
 *              code:
 *                  type: string
 *                  example: invalid_format
 *              description:
 *                  type: string
 *                  example: Id format is not acceptable!
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