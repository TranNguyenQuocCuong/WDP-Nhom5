const express = require('express');
const router = express.Router();
const passport = require('../passport');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authen');
const { userprofile, getHomePage, register, login, logout, getUserProfile, editProfile, changePassword, forgotPassword } = require('../controllers/userController');
const jwt = require('jsonwebtoken');
const Progress = require('../models/progress');

const User = require('../models/users');

router.get('/', getHomePage);

router.post('/register', register);

router.post('/login', login);

router.post('/logout', authenticateToken, logout);

// router.get('/userProfile', authenticateToken, getUserProfile);

// router.put('/edit-profile', authenticateToken, editProfile);


router.post('/forgotpassword', forgotPassword);

// router.get('/userprofile', authenticateToken, userprofile);

router.get('/facebook/token', passport.authenticate('facebook-token'), userController.facebookLogin);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), userController.googleLogin);

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
router.put('/change-password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // currentPassword = '123abc'
    // newPassword = '123456'
    try {
        const user = await User.findById(req.user.id)

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

// Fetch User Transactions by User ID
router.get('/:userId/transactions', async (req, res) => {
    const { userId } = req.params;
    console.log('>>> userId transaction', userId);
    try {
        // Fetch orders for the specified user
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Error fetching transactions' });
    }
});

module.exports = router;
