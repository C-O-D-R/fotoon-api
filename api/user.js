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
// GET api.fotoon.app/user/{userId}
// POST api.fotoon.app/user/follow/{followId}
// POST api.fotoon.app/user/change-password
// PATCH api.fotoon.app/user

// GET User by ID
Router.get('/:id', async (req, res) => {
    // Global variables
    const userId = req.params.id;

    // Id format check
    if (!mongoose.isValidObjectId(userId)) {
        return res.status(406).json({ status: 'error', code: 'invalid_format', description:"Id format is not acceptable!"});
    }

    // Checking for DB and User
    try {
        // Request Database User
        const dbUser = await UserSchema.findOne({ _id: userId }).lean();

        // User Not Found
        if (!dbUser) return res.status(404).json({ status: 'error', code: 'invalid_user', description: `User not found!` });

        // Success User Data
        return res.status(200).json({ status: 'success', code: 'request_success', description: 'User data found successfully!', data: { _id: dbUser._id, username: dbUser.username, avatar: dbUser.avatar, shortBio: dbUser.shortBio, longBio: dbUser.longBio, following: dbUser.following, followers: dbUser.followers } });

    } catch (error) {
        // Failed User Data
        terminal.error(`[SERVER] Failed at user: ${error}`);
        return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error ${error}` });
    }
});

// POST User Follow
Router.post('/follow/:id', authUser, async (req, res) => {
    // Variables
    var userId = req.user.id;
    var followId = req.params.id;

    // Id Format Check
    if (!mongoose.isValidObjectId(userId)) return res.status(406).json({ status: 'error', code: 'invalid_format', description:"Id format is not acceptable!"});

    // Database User
    var dbUser = await UserSchema.findOne({ _id: userId }).lean();
    if (!dbUser) return res.status(404).json({ status: 'error', code: 'user_not_found', description: 'Authenticated user was not found in the database!' });
    // Database Follow 
    var dbFollow = await UserSchema.findOne({ _id: followId }).lean();
    if (!dbFollow) return res.status(404).json({ status: 'error', code: 'user_not_found', description: 'User was not found in the database!' });

    // Update Database
    try {
        // User Update
        await UserSchema.findOneAndUpdate({ _id: dbUser._id }, {
            $push: {
                following: dbFollow._id
            }
        });

        // Follow Update
        await UserSchema.findOneAndUpdate({ _id: dbFollow._id }, {
            $push: {
                followers: dbUser._id
            }
        })

        return res.status(200).json({ status: 'success', code: 'follow_success', description: `Followed ${dbFollow.username}` });
    } catch (error) {
        // Error Failed Update
        terminal.error(`[SERVER] Failed at user: ${error}`);
        return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error ${error}` });
    }
});

// POST User Unfollow
Router.post('/unfollow/:id', authUser, async (req, res) => {
    // Variables
    var userId = req.user.id;
    var unfollowId = req.params.id;

    // Id format check
    if (!mongoose.isValidObjectId(userId)) return res.status(406).json({ status: 'error', code: 'invalid_format', description:"Id format is not acceptable!"});

    // Database User
    var dbUser = await UserSchema.findOne({ _id: userId }).lean();
    if (!dbUser) return res.status(404).json({ status: 'error', code: 'user_not_found', description: 'Authenticated user was not found in the database!' });
    // Database Follow 
    var dbUnfollow = await UserSchema.findOne({ _id: unfollowId }).lean();
    if (!dbUnfollow) return res.status(404).json({ status: 'error', code: 'user_not_found', description: 'User was not found in the database!' });

    // Update Database
    try {
        // User Update
        await UserSchema.findOneAndUpdate({ _id: dbUser._id }, {
            $pull: {
                following: dbUnfollow._id
            }
        });

        // Follow Update
        await UserSchema.findOneAndUpdate({ _id: dbUnfollow._id }, {
            $pull: {
                followers: dbUser._id
            }
        })

        return res.status(200).json({ status: 'success', code: 'unfollow_success', description: `Unfollowed ${dbUnfollow.username}` });
    } catch (error) {
        // Error Failed Update
        terminal.error(`[SERVER] Failed at user: ${error}`);
        return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error ${error}` });
    }
});

// POST User Change Password
Router.post('/change-password', authUser, async (req, res) => {
    // Variables
    var userId = req.user.id;
    var plainPassword = req.body.password;

    // Checks
    // Checks if the password isnt empty
    if(plainPassword.match(/^\s*$/)) return res.status(406).json({ status: 'error', code: 'invalid_password', description: 'Password is empty'});

    if (plainPassword.length < 8) return res.status(406).json({ status: 'error', code: 'invalid_password_length', description: 'Invalid password length!' });

    // Database User
    var dbUser = await UserSchema.findOne({ _id: userId }).lean();
    if (!dbUser) return res.status(404).json({ status: 'error', code: 'user_not_found', description: 'Authenticated user was not found in the database!' });

    // Update Database
    try {
        var hashedPassword = await bcrypt.hash(plainPassword, 10);

        await UserSchema.updateOne({ _id: dbUser._id }, {
            $set: {
                password: hashedPassword
            }
        });

        return res.status(200).json({ status: 'success', code: 'password_changed_successfully', description: 'Password has been changed successfully!' });
    } catch (error) {
        // Error Failed Update
        terminal.error(`[SERVER] Failed at user: ${error}`);
        return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error ${error}` });
    }
});

// PATCH User by Authentication
Router.patch('/', authUser, async (req, res) => {
    // Global Variables
    var userId = req.user.id;

    // Database User
    var dbUser = await UserSchema.findOne({ _id: userId }).lean();
    if (!dbUser) return res.status(404).json({ status: 'error', code: 'user_not_found', description: 'Authenticated user was not found in the database!' });

    // Update Variables
    var avatar = req.body.avatar == undefined ? dbUser.avatar : req.body.avatar;
    var shortBio = req.body.shortBio == undefined ? dbUser.shortBio : req.body.shortBio;
    var longBio = req.body.longBio == undefined ? dbUser.longBio : req.body.longBio;

    // Checks
    // Short Bio - not empty check
    //if(shortBio.match(/^\s*$/)) return res.status(406).json({ status: 'error', code: 'invalid_short_bio', description: 'Short Bio is empty'});
    
    // Short Bio - Character Limit 50
    if (shortBio.length > 50) return res.status(406).json({ status: 'error', code: 'invalid_short_bio_length', description: 'Invalid short bio length!' });

    // Short Bio - not empty check
    //if(longBio.match(/^\s*$/)) return res.status(406).json({ status: 'error', code: 'invalid_long_bio', description: 'Long Bio is empty'});

    // Long Bio - Character Limit 500
    if (longBio.length > 500) return res.status(406).json({ status: 'error', code: 'invalid_long_bio_length', description: 'Invalid long bio length!' });

    // Update
    try {
        // Update
        await UserSchema.findOneAndUpdate({ _id: userId }, {
            $set: {
                avatar: avatar,
                shortBio: shortBio,
                longBio: longBio
            }
        });

        // Success
        return res.status(200).json({ status: 'success', code: 'update_success', description: 'User data updated successfully!' });
    } catch (error) {
        // Error Failed Update
        terminal.error(`[SERVER] Failed at user: ${error}`);
        return res.status(500).json({ status: 'error', code: 'server_error', description: `Internal server error ${error}` });
    }
});

/**
 * @swagger
 * /user/{userId}:
 *  get:
 *      summary: Gauti vartotojo duomenis
 *      description: Pateikus vartotojo ID gaunami jo duomenys
 *      tags:
 *          - user
 *      responses:
 *          '200':
 *              summary: Vartotojo duomenys gauti s??kmingai
 *              description: Kreipiamasi ?? duomen?? baz?? ir gaunami vartotojo duomenys pagal jo ID.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RequestSuccess'
 * 
 *          '406':
 *              summary: Netinkamas ID formatas
 *              description: Pateiktas ID neatitinka MongoDB ObjectID formato.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RequestFailedInvalidFormat'
 * 
 *          '404':
 *              summary: Vartotojas neegzistuoja
 *              description: Pateiktas vartototjo ID neegzistuoja duomen?? baz??je.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RequestFailedInvalidUser'
 * 
 *          '500':
 *              summary: Serverio klaida
 *              description: API klaida, galimas sutrikimas duomen?? baz??je.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'              
 * /user/change-password:
 *  post:
 *      summary: Atnaujinti vartotojo slapta??od??
 *      description: Duomen?? baz??je pakei??iamas vartotojo slapta??odis
 *      tags:
 *          - user
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
 *                          password:
 *                              type: string
 *                              minLength: 8
 *                              example: <password>
 *      responses:
 *          '200':
 *              summary: S??kmingas salpta??od??io pakeitimas
 *              description: Slapta??odis buvo pakeistas s??kmingai
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UpdatePasswordSuccess'
 *          '404':
 *              summary: Vartotojas nerastas
 *              description: Tokio vartotojo n??ra duomen?? baz??je
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UserNotFound'
 *          '500':
 *              summary: Serverio klaida
 *              description: API klaida, galimas sutrikimas duomen?? baz??je.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 *          '406':
 *              summary: Netinkamas slapta??od??io ilgis
 *              description: Slapt??odis neteisingo ilgio
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InvalidPasswordLength'     
 * /user:
 *  patch:
 *      summary: Atnaujinti vartotojo informacij??
 *      description: Duomen?? baz??je pakei??iama bendroji vartotjo informacija
 *      tags:
 *          - user
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          token:
 *                              type: string
 *                              example: <token>
 *                          avatar:
 *                              type: string
 *                              example: <base64image>
 *                          shortBio:
 *                              type: string
 *                              example: <string up to 100 characters>
 *                          longBio:
 *                              type: string
 *                              example: <string up to 1000 characters>
 * 
 *      responses:
 *          '200':
 *              summary: Vartotojo duomenys pakeisti
 *              description: Vartotojo duomenys duomen?? baz??je buvo atnaujinti
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UpdateSuccess'
 *          '406':
 *              summary: Pateikti duomenys neatitinka reikalavim??
 *              description: Pateikti duomenys neatitinka tekstin??s reik??m??s ilgio limit??
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/schemas/PatchFailedShortBioLength'
 *                              - $ref: '#/components/schemas/PatchFailedLongBioLength'
 *          '500':
 *              summary: Serverio klaida
 *              description: API klaida, galimas sutrikimas duomen?? baz??je.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 *          '404':
 *              summary: Vartotojas nerastas
 *              description: Tokio vartotojo n??ra duomen?? baz??je
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UserNotFound'
 * 
 * /user/follow/{userId}:
 *  post:
 *      summary: Prad??ti sekti vartotoj??
 *      description: Duomen?? baz??je atnaujinami duomenys ???followers??? ir ???following??? masyvuose
 *      tags:
 *          - user
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
 *          '406':
 *              summary: Netinkamas ID formatas
 *              description: ID formatas neatitinka standarto
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InvalidIdFormat'
 *          '200':
 *              summary: Operacija pavyko
 *              description: Duomen?? baz??je ???following??? ir ???followers??? masyvai atnaujinti
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SuccessFollow'                                 
 *          '500':
 *              summary: Serverio klaida
 *              description: API klaida, galimas sutrikimas duomen?? baz??je.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 *          '404':
 *              summary: Nerastas vartotojas
 *              description: Duomen?? baz??je n??ra tokio vartotojo
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/schemas/UserNotFound'
 *                              - $ref: '#/components/schemas/UserNotFoundInDb' 
 * 
 * /user/unfollow/{userId}:
 *  post:
 *      summary: Atsekti vartotoja
 *      description: Duomen?? baz??je pakei??iama zmogaus sekimas
 *      tags:
 *          - user
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
 *          '406':
 *              summary: Netinkamas ID formatas
 *              description: ID formatas neatitinka standarto
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InvalidIdFormat'
 *          '200':
 *              summary: Atsektas vartotojas
 *              description: S??kmingai atsektas vartotojas
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SuccessUnfollow'                                 
 *          '500':
 *              summary: Serverio klaida
 *              description: API klaida, galimas sutrikimas duomen?? baz??je.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 *          '404':
 *              summary: Nerastas vartotojas
 *              description: Duomen?? baz??je n??ra tokio vartotojo
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/schemas/UserNotFound'
 *                              - $ref: '#/components/schemas/UserNotFoundInDb'  
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
 *      PatchFailedShortBioLength:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: error
 *              code:
 *                  type: string
 *                  example: invalid_short_bio_length
 *              description:
 *                  type: string
 *                  example: Invalid short bio length!
 * 
 *      PatchFailedLongBioLength:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: error
 *              code:
 *                  type: string
 *                  example: invalid_long_bio_length
 *              description:
 *                  type: string
 *                  example: Invalid long bio length!
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
 * 
 *      UserNotFound:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: error
 *              code:
 *                  type: string
 *                  example: user_not_found
 *              description:
 *                  type: string
 *                  example: Authenticated user was not found in the database!
 * 
 *      UpdatePasswordSuccess:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: success
 *              code:
 *                  type: string
 *                  example: password_changed_successfully
 *              description:
 *                  type: string
 *                  example: Password has been changed successfully!
 * 
 *      InvalidPasswordLength:
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
 *                  example: Invalid password length! 
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
 *      SuccessUnfollow:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: success
 *              code:
 *                  type: string
 *                  example: unfollow_success
 *              description:
 *                  type: string
 *                  example: Unfollowed <unfollowed username>
 * 
 *      UserNotFoundInDb:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: error
 *              code:
 *                  type: string
 *                  example: user_not_found
 *              description:
 *                  type: string
 *                  example: User was not found in the database!
 * 
 *      SuccessFollow:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  example: success
 *              code:
 *                  type: string
 *                  example: follow_success
 *              description:
 *                  type: string
 *                  example: Followed <followed username>                     
 */