const express = require('express');
const router = express.Router();
const User = require('../models/users');

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            password
        });

        await user.save();
        res.status(201).json({ msg: 'Register success' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Register fail' });
        }

        if (user.password !== password) {
            return res.status(400).json({ msg: 'Register fail' });
        }

        res.status(200).json({ msg: 'Login success' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
