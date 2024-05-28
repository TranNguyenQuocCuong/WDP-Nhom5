const express = require('express');
const router = express.Router();

const users = [];

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    users.push({ username, password });
    res.status(201).send('User registered');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.status(200).send('Login successful');
    } else {
        res.status(400).send('Login failed');
    }
});

module.exports = router;
