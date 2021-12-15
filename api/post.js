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
//Post
Router.post('/post', authUser, async (req, res) => {
    //Global variables
    const caption = req.body.caption;

    //Check
    if(caption.length > 100){
        return res.status(406).json({status: 'error', code: 'invalid_caption_length', description: 'Invalid Caption lenght, must be no more than 100 characters'});
    }

    //Creating Post
    try{
        await PostSchema.create({
            userId: req.user.id,
            postImage: req.body.postImage,
            caption: caption
        });
        
        //Success
        return res.status(200).json({status: 'success', code: 'post_success', description: 'Post created successfully'});

    }catch (error) {
        // Failed Post Data
        terminal.error(`[SERVER] Failed at user: ${error}`);
        return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error ${error}` });
    }

});


/**
 * @swagger
 * /post/post:
 *  patch:
 *      summary: Kuriamas posta
 *      description: Kuriamas postas prašant reikšmių iš PostSchema
 *      tags:
 *          - post
 *      responses:
 *          '200'
 *              summarry: Sekmingai sukurtas postas
 *              description: Sekmingai sukurti posto duomenys
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