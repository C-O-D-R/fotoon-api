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

// Mongoose
import mongoose from 'mongoose';


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

    // Id format check
    if (!mongoose.isValidObjectId(commentId)) return res.status(406).json({ status: 'error', code: 'invalid_format', description:"Id format is not acceptable!"});

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
/**
 * @swagger
 * /comment/{commentId}:
 *  get:
 *      summary: Gaunamas komentaras
 *      description: Gaunamas komentaras pagal jo ID
 *      tags:
 *          - comment
 *      responses:
 *          '406':
 *              summary: Neteisingas ID formatas
 *              description: ID formatas per trumpas arba per ilgas
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/WrongIDFormat'
 *          '404':
 *              summary: Nerastas komentaras
 *              description: Nerastas komentaras duomenų bazėje
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CommentNotFound'
 *          '200':
 *              summary: Sėkmingai gautas komentaras
 *              description: Komentaro ID rastas duomenų bazėje ir sėkmingai gautas
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetCommentSuccess'
 *          '500':
 *              summary: Serverio klaida
 *              description: API klaida, galimas sutrikimas duomenų bazėje
 *              content:
 *                  application/json:
 *                      schema:
 *                           $ref: '#/components/schemas/InternalError'
 * /comment:
 *  post:
 *      summary: Sukuriamas komentaras
 *      description: Sukuriamas ir įrašomas komentaras
 *      tags:
 *          - comment
 *      requestBody:
 *          required: true,
 *          constent:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          postId:
 *                              type: string
 *                              example: <postId>
 *                          userId:
 *                              type: string
 *                              example: <userId>
 *                          text:
 *                              type: string
 *                              maxLength: 150
 *                              example: text
 *      responses:
 *          '406':
 *              summary: Komentaras neatitinka reikalavimų
 *              description: Komentaras ilgesnis nei 150 simbolių
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotValidComment'
 *          '200':
 *              summary: Sukuriamas Komentaras
 *              description: Sėkmingai patikrintas ir sukurtas komentaras
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PostSuccess'
 *          '500':
 *              summary: Serverio klaida
 *              description: API klaida, galimas sutrikimas duomenų bazėje
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 * 
 * components:
 *  schemas:
 *      WrongIDFormat:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: error
 *              code:
 *                  type: string
 *                  example: comment_not_found
 *              description:
 *                  type: string
 *                  example: Id format is not acceptable!
 *      CommentNotFound:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: error
 *              code:
 *                  type: string
 *                  example: comment_not_found
 *              description:
 *                  type: string
 *                  example: Specified comment was not found!
 *      GetCommentSuccess:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: success
 *              code:
 *                  type: string
 *                  example: comment_found
 *              description:
 *                  type: string
 *                  example: Comment has been found!
 *              data:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          postId:
 *                              type: string
 *                              example: <post ID>
 *                          userId:
 *                              type: string
 *                              example: <user ID>
 *                          text:
 *                              type: string
 *                              example: <text>
 *                          date:
 *                              type: string
 *                              example: <date>
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
 *      NotValidComment:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: error
 *              code:
 *                  type: string
 *                  example: invalid_text_length
 *              description:
 *                  type: string
 *                  example: Text has to be less than 150 characters
 *      PostSuccess:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: success
 *              code:
 *                  type: string
 *                  example: comment_created_successfully
 *              description:
 *                  type: string
 *                  example: Comment has been created!
 */