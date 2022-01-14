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

// GET All Posts
Router.get('/', authUser, async (req, res) => {
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

// POST a Post
Router.post('/', authUser, async (req, res) => {
    // Global variables
    var userId = req.user.id;
    var image = req.body.image;
    var caption = req.body == undefined ? ' ' : req.body.caption;

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
 *          '406':
 *              summary: Neteisingas ID
 *              description: Pateiktas ID neteisingu formatu 
 *              content:
 *                  application/json: 
 *                      schema:
 *                          $ref: '#/components/schemas/InvalidIdFormat'
 *          '200':
 *              summary: Sėkmingai gautas įrašas
 *              description: Pagal ID grąžinamas įrašas
 *              content:
 *                  application/json: 
 *                      schema:
 *                          $ref: '#/components/schemas/GetPostSuccess'
 *          '404':
 *              summary: Įrašas nerastas
 *              description: Pagal ID nėra įrašo
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PostNotFound'
 *          '500':
 *              summary: Serverio klaida
 *              description: API klaida, galimas sutrikimas duomenų bazėje.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 *      
 * /post/:
 *  get:
 *      summary: Gaunami įrašai
 *      description: Gaunami visi su autentifikuotu naudotoju susiję įrašai
 *      tags:
 *          - post
 *      responses:
 *          '200':
 *              summary: Sėkmingai gauti įrašai
 *              description: Sėkmingai gauti įrašai, pagal pateiktus ID's
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetPostsSuccess'
 *          '500':
 *              summary: Serverio klaida
 *              description: API klaida, galimas sutrikimas duomenų bazėje.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'             
 * /post:
 *  post:
 *      summary: Kurti įrašą
 *      description: Sukuriamas įrašas MongoDB duomenų bazėje
 *      tags:
 *          - post
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          image:
 *                              type: string
 *                              example: <base64>
 *                          caption:
 *                              type: text
 *                              example: caption
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
 *          '406':
 *              summary: Neteisinga antraštė
 *              description: Pateikta antraštė ilgesnė nei 100 simbolių
 *              content:
 *                  application/json: 
 *                      schema:
 *                          $ref: '#/components/schemas/InvalidCaptionFormat'
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