// routes/coaches.js

const express = require('express');
const router = express.Router();
const Coach = require('../models/coaches');
const User = require('../models/users');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { authenticateToken } = require('../middlewares/authen');
require('dotenv').config();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('--------------LOGIN CHECK---------------\n');
    console.log('>>> username, password: ', username, ' --- ', password);

    try {
        const coach = await Coach.findOne({ username });
        console.log('>>> user: ', coach);
        if (!coach) {
            console.log('Username is incorrect');
            return res.status(400).json({ msg: 'Username is incorrect' });
        }

        // So sánh mật khẩu
        // const isMatch = await bcrypt.compare(password, user.password);
        const isMatch = await Coach.findOne({ password });
        if (!isMatch) {
            console.log('Password is incorrect');
            return res.status(400).json({ msg: 'Password is incorrect' });
        }
        console.log("LOGIN SUCCESSFULLY");
        const token = jwt.sign({ id: coach._id, username: coach.username }, process.env.SECRET_KEY, { expiresIn: '1h' });
        console.log('>>> SECRET_KEY: ', process.env.SECRET_KEY);
        console.log('>>> token: ', token);
        return res.status(200).json({ msg: 'Login success', token });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server error' });
    }
});
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

router.get('/is-coach', async (req, res) => {
    try {
      const userId = req.user.id;
      const coach = await Coach.findOne({ userId });
      if (coach) {
        res.status(200).json({ isCoach: true });
      } else {
        res.status(200).json({ isCoach: false });
      }
    } catch (error) {
      console.error('Error checking if user is a coach:', error);
      res.status(500).json({ message: 'Error checking coach status', error: error.message });
    }
  });

router.get('/coachProfile', authenticateToken, async (req, res) => {
    // const username = req.params.username;
    // const user = await User.findById(req.user.id)
    // console.log(">>> username >>> ", username);
    console.log(">>> req.user.id >>> ", req.user.id);
    try {
        const coach = await Coach.findById(req.user.id)
        console.log('>>> user: ', coach);
        if (!coach) {
            return res.status(400).json({ msg: 'Coach not found' });
        }

        res.status(200).json(coach);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.put('/change-password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const coach = await Coach.findById(req.user.id)

        if (!coach) {
            return res.status(400).json({ msg: 'User not found' });
        }

        if (coach.password !== currentPassword) {
            return res.status(400).json({ msg: 'Incorrect current password' });
        }

        coach.password = newPassword;
        await coach.save();

        res.status(200).json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.put('/edit-profile', authenticateToken, async (req, res) => {
    const { name, email, age, address } = req.body;
    console.log(">>> req.user.id >>> ", req.user.id);


    // Validation
    if (!name || !email) {
        console.log("Please provide all required fields: name, email");
        return res.status(400).json({ msg: 'Please provide all required fields: name, email' });
    }

    try {
        // Find the user by userId (you should validate the userId before using it)
        const coach = await Coach.findById(req.user.id);
        console.log('>>> Coach Edit Profile: ', coach);

        if (!coach) {
            console.log('User not found');
            return res.status(400).json({ msg: 'User not found' });
        }

        // Update the user profile
        coach.name = name;
        coach.email = email;
        coach.address = address;
        coach.age = age;

        await coach.save();
        console.log('Profile updated successfully');

        res.status(200).json({ msg: 'Profile updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/my-student', authenticateToken, async (req, res) => {
    const coachId = req.user.id;

    try {
        console.log('Coach ID:', coachId);

        const users = await User.find({ subscribedCoach: coachId });
        console.log('Courses found:', users);

        res.json(users);
    } catch (err) {
        console.error('Error fetching user courses:', err);
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
