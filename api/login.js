// ----------------------------------------------------------------
// Imports
// ----------------------------------------------------------------
// DOTENV
import { config } from 'dotenv';
config();

// Express
import express from 'express';

// Bcrypt
import bcrypt from 'bcryptjs';

// Json Web Token
import jwt from 'jsonwebtoken';

// User Schema
import UserSchema from '../models/UserSchema.js';


// --------------------------------------------------------------
// Router
// --------------------------------------------------------------
// Export Router
const Router = express.Router();
export default Router;


// -------------------------------------------------------------
// Routes
// -------------------------------------------------------------
// Login
Router.post('/', async (req, res) => {
    // Request Credentials
    const usernamePlain = req.body.username.toLowerCase();
    const passwordPlain = req.body.password;

    // Request Database User
    const dbUser = await UserSchema.findOne({ username: usernamePlain }).lean();

    // Login
    try {
        if (dbUser && await bcrypt.compare(passwordPlain, dbUser.password)) {
            // JWT Token
            const token = jwt.sign({ id: dbUser._id , username: dbUser.username}, process.env.SERVER_JWT_SECRET);

            // General Success Authentication
            return res.status(200).cookie('token', token, { httpOnly: true, secure: true }).json({ status: 'success', code: 'login_success', description: 'User authenticated successfully!'});
        } else {
            // Password/Username/JWT Failed Authentication
            return res.status(401).json({ status: 'error', code: 'invalid_credentials', description: 'Invalid username or password!' });
        }
    } catch (error) {
        // Error Failed Authentication
        terminal.error(`[SERVER] Failed at login: ${error}`);
        return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error ${error}` });
    }
});


// --------------------------------------------------------------
// Documentation
// --------------------------------------------------------------
/**
 * @swagger
 * /login:
 *  post:
 *      summary: Prisijungti
 *      description: Pateikus vartotojo vardą ir slaptažodį gaunamas JWT raktas, reikalingas tolimesnei autentifikacijai.
 *      tags:
 *          - main
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              example: username
 *                          password:
 *                              type: string
 *                              format: password
 *                              example: password
 *      responses:
 *          '200':
 *              summary: Prisijungti pavyko
 *              description: BCrypt biblioteka patikrino ar slaptažodis sutampa su „hashed“ slaptažodiu ir JWT pasirašė raktą „token“.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/LoginSuccess'
 *          '401':
 *              summary: Prisijungti nepavyko
 *              description: BCrypt biblioteka nurodė, kad slaptažodžiai skirtingi arba iškilo problema pasirašant JTW raktą.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/LoginFailed'
 *          '500':
 *              summary: Serverio klaida
 *              description: API klaida, galimas sutrikimas BCrypt arba JWT bibliotekose.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 * 
 * components:
 *  schemas:
 *      LoginSuccess:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: success
 *              code:
 *                  type: string
 *                  example: login_success
 *              description:
 *                  type: string
 *                  example: User authenticated successfully!
 *              data:
 *                  type: object
 *                  properties:
 *                      token:
 *                          type: string
 *                          example: <jwttoken>
 * 
 *      LoginFailed:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: error
 *              code:
 *                  type: string
 *                  example: invalid_credentials
 *              description:
 *                  type: string
 *                  example: Invalid username or password!
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