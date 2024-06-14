// routes/coaches.js

const express = require('express');
const router = express.Router();
const Coach = require('../models/coaches');

// Route để tạo mới một Coach
router.post('/', async (req, res) => {
    const { username, password, email, name, address, age } = req.body;

    try {
        // Kiểm tra xem username hoặc email đã tồn tại chưa
        let existingCoach = await Coach.findOne({ $or: [{ username }, { email }] });
        if (existingCoach) {
            return res.status(400).json({ msg: 'Coach already exists' });
        }

        const newCoach = new Coach({
            username,
            password,
            email,
            name,
            address,
            age
        });

        const coach = await newCoach.save();
        res.status(201).json(coach);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route để lấy danh sách tất cả Coach
router.get('/', async (req, res) => {
    try {
        const coaches = await Coach.find();
        res.json(coaches);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route để lấy thông tin của một Coach bằng ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const coach = await Coach.findById(id);
        if (!coach) {
            return res.status(404).json({ msg: 'Coach not found' });
        }
        res.json(coach);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route để cập nhật thông tin của một Coach bằng ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password, email, name, address, age } = req.body;

    try {
        let coach = await Coach.findById(id);
        if (!coach) {
            return res.status(404).json({ msg: 'Coach not found' });
        }

        coach.username = username || coach.username;
        coach.password = password || coach.password;
        coach.email = email || coach.email;
        coach.name = name || coach.name;
        coach.address = address || coach.address;
        coach.age = age || coach.age;

        coach = await coach.save();
        res.json(coach);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route để xóa một Coach bằng ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const coach = await Coach.findById(id);
        if (!coach) {
            return res.status(404).json({ msg: 'Coach not found' });
        }

        await coach.remove();
        res.json({ msg: 'Coach removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
