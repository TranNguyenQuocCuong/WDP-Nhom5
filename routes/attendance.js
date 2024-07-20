const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance');
const User = require('../models/users');
const Course = require('../models/courses');
const Coach = require('../models/coaches');
const { authenticateToken } = require('../middlewares/authen');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { userId, courseId, date, timeStartHour, timeStartMinute, timeEndHour, timeEndMinute, status } = req.body;

        const attendance = new Attendance({
            userId,
            courseId,
            date,
            timeStartHour,
            timeStartMinute,
            timeEndHour,
            timeEndMinute,
            status
        });

        await attendance.save();

        res.status(201).json({ message: 'Attendance recorded successfully', attendance });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error recording attendance', error: error.message });
    }
});

// Route to get attendance for a specific course
router.get('/attendance/course/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params;
        const attendance = await Attendance.find({ courseId }).populate('userId', 'username');
        res.status(200).json(attendance);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error fetching attendance', error: error.message });
    }
});

module.exports = router;
