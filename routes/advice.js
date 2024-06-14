// routes/advice.js

const express = require('express');
const router = express.Router();
const Advice = require('../models/advice');
const Coach = require('../models/coaches');
const User = require('../models/users');

// Route để huấn luyện viên gửi lời khuyên cho người dùng
router.post('/send', async (req, res) => {
    const { coachId, userId, message } = req.body;

    try {
        // Kiểm tra xem huấn luyện viên và người dùng có tồn tại không
        const coach = await Coach.findById(coachId);
        if (!coach) {
            return res.status(404).json({ msg: 'Coach not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Tạo lời khuyên mới
        const newAdvice = new Advice({
            coachId,
            userId,
            message
        });

        // Lưu vào cơ sở dữ liệu
        const advice = await newAdvice.save();

        res.status(201).json(advice);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Route để xem các lời khuyên từ huấn luyện viên cho một người dùng
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const advices = await Advice.find({ userId }).populate('coachId');
        res.status(200).json(advices);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
