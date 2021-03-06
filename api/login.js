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
    const usernamePlain = req.body.username;
    const passwordPlain = req.body.password;

    // Checks
    if (usernamePlain == undefined) return;

    if(usernamePlain.match(/^\s*$/)) return res.status(406).json({ status: 'error', code: 'invalid_username', description: 'Username is empty'});

    if(passwordPlain.match(/^\s*$/)) return res.status(406).json({ status: 'error', code: 'invalid_pasword', description: 'Password is empty'});

    // Request Database User
    const dbUser = await UserSchema.findOne({ username: usernamePlain.toLowerCase() }).lean();
    

    // Login
    try {
        if (dbUser && await bcrypt.compare(passwordPlain, dbUser.password)) {
            // JWT Token
            const token = jwt.sign({ id: dbUser._id, username: dbUser.username }, process.env.JWT_SECRET);

            // General Success Authentication
            return res.status(200).json({ status: 'success', code: 'login_success', description: 'User authenticated successfully!', data: { token: token } });
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
 *      description: Pateikus vartotojo vard?? ir slapta??od?? gaunamas JWT raktas, reikalingas tolimesnei autentifikacijai.
 *      tags:
 *          - auth
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
 *              description: BCrypt biblioteka patikrino ar slapta??odis sutampa su ???hashed??? slapta??odiu ir JWT pasira???? rakt?? ???token???.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/LoginSuccess'
 *          '401':
 *              summary: Prisijungti nepavyko
 *              description: BCrypt biblioteka nurod??, kad slapta??od??iai skirtingi arba i??kilo problema pasira??ant JTW rakt??.
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