const express = require('express');
const router = express.Router();
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { authenticateToken } = require('../middlewares/authen');
const Progress = require('../models/progress');

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

router.post('/forgotpassword', async (req, res) => {
    const { email } = req.body;
    console.log('>>> email: ', email);
    try {
        const user = await User.findOne({ email: email });
        console.log('>>> User: ', user);
        if (!user) {
            console.log("User not existed");
            return res.send({ Status: "User not existed" });
        }
        const token = jwt.sign({ id: user._id }, "jwt_secret_key", { expiresIn: "1d" });
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'phandinhdan6666@gmail.com',
                pass: 'nxum kgxi agdf rnvi'
            }
        });

        var mailOptions = {
            from: 'phandinhdan6666@gmail.com',
            to: email,
            subject: 'Reset Password Link',
            text: `http://localhost:3000/resetpassword/${user._id}/${token}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                return res.send({ Status: "Success" });
            }
        });
    } catch (error) {
        console.log(error);
    }
});

// Reset password route
router.post('/resetpassword/:id/:token', (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    console.log('ID:', id);
    console.log('Token:', token);
    console.log('Password:', password);
    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if (err) {
            return res.json({ Status: "Error with token" });
        } else {
            User.findByIdAndUpdate({ _id: id }, { password: password })
                .then(u => res.send({ Status: "Success" }))
                .catch(err => res.send({ Status: err }));
        }
    })
})

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('--------------LOGIN CHECK---------------\n');
    console.log('>>> username, password: ', username, ' --- ', password);

    try {
        const user = await User.findOne({ username });
        console.log('>>> user: ', user);
        if (!user) {
            console.log('Username is incorrect');
            return res.status(400).json({ msg: 'Username is incorrect' });
        }

        // So sánh mật khẩu
        // const isMatch = await bcrypt.compare(password, user.password);
        const isMatch = await User.findOne({ password });
        if (!isMatch) {
            console.log('Password is incorrect');
            return res.status(400).json({ msg: 'Password is incorrect' });
        }
        console.log("LOGIN SUCCESSFULLY");
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '1h' });
        console.log('>>> SECRET_KEY: ', process.env.SECRET_KEY);
        console.log('>>> token: ', token);
        return res.status(200).json({ msg: 'Login success', token });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server error' });
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

// Get profile route
router.get('/userProfile', authenticateToken, async (req, res) => {
    // const username = req.params.username;
    // const user = await User.findById(req.user.id)
    // console.log(">>> username >>> ", username);
    console.log(">>> req.user.id >>> ", req.user.id);
    try {
        const user = await User.findById(req.user.id)
        console.log('>>> user: ', user);
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.put('/edit-profile', authenticateToken, async (req, res) => {
    const { name, email, gender, age, phone, address } = req.body;
    console.log(">>> req.user.id >>> ", req.user.id);

    console.log('>>> name:', name, ' - ', '>>> email:', email, ' - ', '>>> gender:', gender, ' - ', '>>> age:', age, ' - ', '>>> phone:', phone, ' - ', '>>> address:', address);

    // Validation
    if (!name || !email || !gender) {
        console.log("Please provide all required fields: name, email, and gender");
        return res.status(400).json({ msg: 'Please provide all required fields: name, email, and gender' });
    }

    try {
        // Find the user by userId (you should validate the userId before using it)
        const user = await User.findById(req.user.id);
        console.log('>>> User Edit Profile: ', user);

        if (!user) {
            console.log('User not found');
            return res.status(400).json({ msg: 'User not found' });
        }

        // Update the user profile
        user.name = name;
        user.email = email;
        user.gender = gender;
        user.address = address;
        user.age = age;
        user.phone = phone;

        console.log(">>>email<<<", email); // sửa lỗi log từ name thành email

        await user.save();
        console.log('Profile updated successfully');

        res.status(200).json({ msg: 'Profile updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Change password route
router.put('/change-password', async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // currentPassword = '123abc'
    // newPassword = '123456'
    try {
        // const user = await User.findById(userId);
        const user = await User.findOne({ username: "User1" });

        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        if (user.password !== currentPassword) {
            return res.status(400).json({ msg: 'Incorrect current password' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/', async (req, res) => {
    const { coach } = req.query;

    try {
        if (!coach) {
            return res.status(400).json({ message: 'No coach IDs provided in query' });
        }

        const coachIds = coach.split(',').map(id => id.trim()); // Ensure coachIds is an array of trimmed IDs

        if (coachIds.length === 0) {
            return res.status(400).json({ message: 'No valid coach IDs provided in query' });
        }

        const users = await User.find({ subscribedCoach: { $in: coachIds } });

        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving users' });
    }
});

router.get('/:id/progress', authenticateToken, async (req, res) => {
    try {
        const progress = await Progress.findOne({ userId: req.params.id });
        if (!progress) return res.status(404).json({ message: 'Progress not found' });
        res.json(progress);
    } catch (error) {
        console.error('Error fetching user progress:', error);
        res.status(500).send('Server error');
    }
});

router.put('/:id/progress', authenticateToken, async (req, res) => {
    const { weight, height} = req.body;
    try {
        const progress = await Progress.findOneAndUpdate(
            { userId: req.params.id },
            { weight, height},
            { new: true }
        );
        if (!progress) return res.status(404).json({ message: 'Progress not found' });
        res.json(progress);
    } catch (error) {
        console.error('Error updating user progress:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
