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

    // Update
    try {
        // Update
        await UserSchema.findOneAndUpdate({ _id: userId }, {
            $set: { profilePicture: profilePicture }
        });

        // Success
        return res.status(200).json({ status: 'success', code: 'update_success', description: 'User data updated successfully!' });
    } catch (error) {
        // Error Failed Update
        terminal.error(`[SERVER] Failed at user: ${error}`);
        return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error ${error}` });
    }
});

/* Decode Base64 Image From User Data
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
*/

// Get user
Router.get('/:id', async (req, res) => {
    // Global variables
    const userId = req.params.id;

    // Checking for DB and User
    try {
        // Wrong ID Format
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ status: 'error', code: 'invalid_format', description: `Invalid format!` });

        // Request Database User
        const dbUser = await UserSchema.findOne({ _id: userId }).lean();

        // User Not Found
        if (!dbUser) return res.status(404).json({ status: 'error', code: 'invalid_user', description: `User not found!` });

        // Success User Data
        return res.status(200).json({ status: 'success', code: 'request_success', description: 'User data found successfully!', data: { username: dbUser.username, profilePicture: dbUser.profilePicture }});

    } catch (error) {
        // Failed User Data
        terminal.error(`[SERVER] Failed at user: ${error}`);
        return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error ${error}` });
    }
});

/**
 * @swagger
 * /user/update:
 *  patch:
 *      summary: Atnaujinti vartotojo informaciją
 *      description: Duomenų bazėje pakeičiama bendroji vartotjo informacija
 *      tags:
 *          - user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties: 
 *                          data:
 *                              type: object
 *                              properties:
 *                                  token: 
 *                                      type: string
 *                                      example: <jwttoken>
 *                                  profilePicture:
 *                                      type: string
 *                                      example: <base64image>
 *      responses:
 *          '200':
 *              summary: Vartotojo duomenys pakeisti
 *              description: Vartotojo duomenys duomenų bazėje buvo atnaujinti
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UpdateSuccess'
 *          '500':
 *              summary: Serverio klaida
 *              description: API klaida, galimas sutrikimas duomenų bazėje.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 * /user/{userId}:
 *  get:
 *      summary: Gauti vartotojo duomenis
 *      description: Pateikus vartotojo ID gaunami jo duomenys
 *      tags:
 *          - user
 *      responses:
 *          '200':
 *              summary: Vartotojo duomenys gauti sėkmingai
 *              description: Kreipiamasi į duomenų bazę ir gaunami vartotojo duomenys pagal jo ID.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RequestSuccess'
 * 
 *          '400':
 *              summary: Netinkamas ID formatas
 *              description: Pateiktas ID neatitinka MongoDB ObjectID formato.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RequestFailedInvalidFormat'
 * 
 *          '404':
 *              summary: Vartotojas neegzistuoja
 *              description: Pateiktas vartototjo ID neegzistuoja duomenų bazėje.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RequestFailedInvalidUser'
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
 *      UpdateSuccess:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: success
 *              code:
 *                  type: string
 *                  example: update_success
 *              description:
 *                  type: string
 *                  example: User data updated successfully!
 *                  
 *      RequestSuccess:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: success
 *              code:
 *                  type: string
 *                  example: request_success
 *              description:
 *                  type: string
 *                  example: User data found successfully!
 *              data:
 *                  type: object
 *                  properties:
 *                      username:
 *                          type: string
 *                          example: username
 *                      profilePicture:
 *                          type: string
 *                          example: <base64image>
 *
 *      RequestFailedInvalidFormat:
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
 *                  example: Invalid format!
 *
 *      RequestFailedInvalidUser:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: error
 *              code:
 *                  type: string
 *                  example: invalid_user
 *              description:
 *                  type: string
 *                  example: User not found!
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