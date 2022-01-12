// ----------------------------------------------------------------
// Imports
// ----------------------------------------------------------------
// Express
import express from 'express';

// Bcrypt
import bcrypt from 'bcryptjs';

// User Schema
import UserSchema from '../models/UserSchema.js';


// --------------------------------------------------------------
// Router
// --------------------------------------------------------------
const Router = express.Router();
export default Router;


// ----------------------------------------------------------------
// Routes
// ----------------------------------------------------------------
// Register
Router.post('/', async (req, res) => {
    // Request Credentials
    const usernamePlain = req.body.username.toLowerCase();
    const passwordPlain = req.body.password;

    // Checks
    // Types
    if (!usernamePlain || typeof usernamePlain !== 'string') {
        return res.status(406).json({ status: 'error', code: 'invalid_username_type', description: 'Invalid username type!' });
    }

    if (!passwordPlain || typeof passwordPlain !== 'string') {
        return res.status(406).json({ status: 'error', code: 'invalid_password_type', description: 'Invalid password type!' });
    }

    // Validation
    if (!usernamePlain.match(/^[a-zA-Z\-]+$/)) {
        return res.status(404).json({ status: 'error', code: 'invalid_username_string', description: 'Invalid username string (username has to consist only of A-Z, a-z, -)!' });
    }

    // Lengths
    if (passwordPlain.length < 8) {
        return res.status(406).json({ status: 'error', code: 'invalid_password_length', description: 'Invalid password length (should be more than 8 characters)!' });
    }

    if (usernamePlain.length < 4 || usernamePlain.length > 20) {
        return res.status(406).json({ status: 'error', code: 'invalid_username_length', description: 'Invalid username length, username should be more than 4 characters and less than 20!' });
    }

    // Hashed Password
    const passwordHashed = await bcrypt.hash(passwordPlain, 10);

    // Update Database
    try {
        // Create User
        await UserSchema.create({
            username: usernamePlain,
            password: passwordHashed
        })

        // General Success Registration
        return res.status(200).json({ status: 'success', code: 'registration_success', description: 'User registered successfully!' });
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate Username Failed Registration
            return res.status(406).json({ status: 'error', code: 'username_exists', description: 'Username already exists!' });
        } else {
            // Error Failed Registration
            terminal.error(`[SERVER] Failed at register: ${error}`);
            return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error: ${error}` });
        }
    }
});


// -------------------------------------------------------------
// Documentation
// -------------------------------------------------------------
/**
 * @swagger
 * /register:
 *  post:
 *      summary: Užsiregsitruoti
 *      description: Pateikus vartojo vardą ir slaptažodį, duomenų bazėje bus sukuriamas įrašas.
 *      tags:
 *          - auth
 *      requestBody:
 *          required: true,
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              minLength: 5
 *                              maxLength: 20
 *                              example: username
 *                          password:
 *                              type: string
 *                              minLength: 8
 *                              format: password
 *                              example: password
 *      responses:
 *          '200':
 *              summary: Užsiregistruoti pavyko
 *              description: Sukuriamas įrašas duomenų bazėje su užšifruotu slaptažodžiu.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RegistrationSuccess'
 *          '406':
 *              summary: Netinkami registracijos duomenys
 *              description: Toks varotojas jau egzistuoja arba slapyvardis ar slaptažodis neatitinka nurodymų.
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/schemas/RegistrationFailedUsernameLength'
 *                              - $ref: '#/components/schemas/RegistrationFailedPasswordLength'
 *                              - $ref: '#/components/schemas/RegistrationFailedUsernameType'
 *                              - $ref: '#/components/schemas/RegistrationFailedPasswordType'
 *                              - $ref: '#/components/schemas/RegistrationFailedUsernameString' 
 *                              - $ref: '#/components/schemas/RegistrationFailedUsernameExists'         
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
 *      RegistrationSuccess:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: success
 *              code:
 *                  type: string
 *                  example: registration_success
 *              description:
 *                  type: string
 *                  example: User registered successfully!
 *      RegistrationFailedUsernameLength:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: error
 *              code:
 *                  type: string
 *                  example: invalid_username_length
 *              description:
 *                  type: string
 *                  example: Invalid username length, username should be more than 4 characters and less than 20!
 *      RegistrationFailedPasswordLength:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: error
 *              code:
 *                  type: string
 *                  example: invalid_password_length
 *              description:
 *                  type: string
 *                  example: Invalid password length (should be more than 8 characters)!
 *      RegistrationFailedUsernameType:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: error
 *              code:
 *                  type: string
 *                  example: invalid_username_type
 *              description:
 *                  type: string
 *                  example: Invalid username type!
 *      RegistrationFailedPasswordType:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: error
 *              code:
 *                  type: string
 *                  example: invalid_password_type
 *              description:
 *                  type: string
 *                  example: Invalid password type!
 *      RegistrationFailedUsernameString:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: error
 *              code:
 *                  type: string
 *                  example: invalid_username_string
 *              description:
 *                  type: string
 *                  example: Invalid username string (username has to consist only of A-Z, a-z, -)!
 *      RegistrationFailedUsernameExists:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: error
 *              code:
 *                  type: string
 *                  example: username_exists
 *              description:
 *                  type: string
 *                  example: Username already exists!
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