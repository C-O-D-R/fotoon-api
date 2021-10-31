// Libraries
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Schemas
const User = require('./models/user.js');

// Mongo DB
mongoose.connect(process.env.MONGO_SRV, { useNewUrlParser: true, useUnifiedTopology: true });

// Server
const server = express();

// Parser
server.use(bodyParser.json());

// Root Route
server.use('/', express.static(path.join(__dirname, 'static')));

// Register Route
server.post('/api/register', async (req, res) => {
    const  { username, password: plainTextPassword } = req.body;

    // Checks
    if (!username || typeof username !== 'string') {
        return res.json({ status: 'error', error: 'Invalid username!' });
    }

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', error: 'Invalid password!' });
    }

    if (plainTextPassword.length < 8) {
        return res.json({ status: 'error', error: 'Invalid password length!' });
    }

    const password = await bcrypt.hash(plainTextPassword, 10);

    try {
        await User.create({
            username,
            password 
        });
    } catch (error) {
        // Duplicate Key
        if (error.code === 11000) {
            return res.json({ status: 'error', error: 'Username already exists!' });
        }

        // Something Else
        throw error;
    }

    res.json({ status: 'ok' });
});

// Login Route
server.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).lean();

    if (!user) {
        return res.json({ status: 'error', error: 'Invalid username/password' });
    }

    if (await bcrypt.compare(password, user.password )) {
        const token = jwt.sign({ id: user._id, username: user.name }, process.env.JWT_SECRET);

        return res.json({ status: 'ok', data: token });
    }

    return res.json({ status: 'error', error: 'Invalid username/password' });
});

// Change Password Route
server.post('/api/change-password', async (req, res) => {
    const { token, newpassword } = req.body;

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const _id = user.id;

        const hashedPassword = await bcrypt.hash(newpassword, 10);

        await User.findByIdAndUpdate({ _id }, {
            $set: { password: hashedPassword }
        });

        res.json({ status: 'ok', error: 'Password changed successfully'});

    } catch (error) {
        console.log(error);
        res.json({ status: 'error', error: 'Invalid signature!' });
    }
});

// Server Listen
server.listen(3000, () => {
    console.log('Server up at 3000');
});
