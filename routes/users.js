const express = require('express');
const router = express.Router();
const User = require('../models/users');

// Route to register a new user
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            password,
            email
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

// Route to edit user profile
router.put('/edit/:userId', async (req, res) => {
    const { userId } = req.params;
    const { password, name, address, gender, age } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update the user's profile
        user.password = password || user.password;
        user.name = name || user.name;
        user.address = address || user.address;
        user.gender = gender || user.gender;
        user.age = age || user.age;

        await user.save();
        res.status(200).json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
