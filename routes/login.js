// Libraries
const express = require('express');

// Router
const router = express.Router();

// Login Route
router.get('/', (req, res) => {
    res.send('Login screen');
});

// Export
module.exports = router;