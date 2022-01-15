// ----------------------------------------------------------------
// Imports
// ----------------------------------------------------------------
// Express
import express from 'express';

// User Schema
import UserSchema from '../models/UserSchema.js';

// Bcrypt
import bcrypt from 'bcryptjs';

// Mongoose
import mongoose from 'mongoose';


// ----------------------------------------------------------------
// Router
// ----------------------------------------------------------------
// Export Router
const Router = express.Router();
export default Router;


// ----------------------------------------------------------------
// Routes
// ----------------------------------------------------------------
// GET api.fotoon.app/users
// Post all users
Router.get('/',  async (req, res) => {
    // Checking for DB user
    try {
        // Get users
        var dbUsers = await UserSchema.find().lean();

        // Success
        return res.status(200).json({ status: 'success', code: 'get_all_users', description: 'Got all users successfully', data: dbUsers });

    } catch (error) {
        // Failed User Data
        terminal.error(`[SERVER] Failed at users: ${error}`);
        return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error ${error}` });
    }
    
});

/**
 * @swagger
 * /users:
 *  get:
 *      summary: Gauti visus „Fotoon“ varotojus
 *      description: Kreipiamasi į „users“ duomenų bazės kolekciją ir grąžinami visi varototjai
 *      tags:
 *          - users
 *      responses:
 *          '200':
 *              summary: Vartotojų duomenys sėkmingai gauti
 *              description: Operacija buvo atlikta sėkmingai
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RequestSuccess'
 *          '500':
 *              summary: Serverio klaida
 *              description: API klaida, galimas sutrikimas duomenų bazėje.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalServerError'
 * components:
 *  schemas:
 *      RequestSuccess:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: success
 *              code:
 *                  type: string
 *                  example: get_all_users
 *              description:
 *                  type: string
 *                  example: Got all users successfully
 * 
 *      InternalServerError:
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