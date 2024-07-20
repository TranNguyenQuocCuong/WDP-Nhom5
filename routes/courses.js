const express = require('express');
const router = express.Router();
const Course = require('../models/courses');
const User = require('../models/users');
const Coach = require('../models/coaches');
const Workout = require('../models/workout');
require('dotenv').config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const {authenticateToken} = require('../middlewares/authen')

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//   router.get('/:courseId', async (req, res) => {
//     const courseId = req.params.courseId;

//     try {
//         const course = await Course.findById(courseId);

//         if (!course) {
//             return res.status(404).json({ message: 'Course not found' });
//         }

//         res.json(course);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Error retrieving course' });
//     }
// });

router.get('/my-courses', authenticateToken, async (req, res) => {
    const coachId = req.user.id;

    try {
        console.log('Coach ID:', coachId);

        const courses = await Course.find({ coaches: { $in: [coachId] } });
        console.log('Courses found:', courses);

        res.json(courses);
    } catch (err) {
        console.error('Error fetching user courses:', err);
        res.status(500).send('Server error');
    }
});
router.get('/:courseId/workouts', async (req, res) => {
    const courseId = req.params.courseId;

    try {
        const course = await Course.findById(courseId).populate('workouts');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(course.workouts);
    } catch (error) {
        console.error('Error fetching workouts:', error);
        res.status(500).send('Server error');
    }
});
router.post('/', authenticateToken, (req, res, next) => {
    console.log(req.user);
    const coachId = req.user.id;
    const courseData = { ...req.body, coaches: [coachId] };
  
    Course.create(courseData)
      .then((course) => {
        console.log('Course Created ', course);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(course);
      })
      .catch((err) => next(err));
  });
// router.post('/', authenticateToken, async (req, res) => {
//     const userId = req.course.id;
//     const { name, description, workouts, coaches } = req.body;

//     try {
//         const newCourse = new Course({
//             name,
//             description,
//             workouts,
//             coaches
//         });

//         const course = await newCourse.save();
//         res.status(201).json(course);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// });

// Route để xem các khóa học đã đăng ký theo ID người dùng
router.get('/subscribed/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).populate('subscribedCourses');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.status(200).json(user.subscribedCourses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route để thêm khóa học vào danh sách đã đăng ký của người dùng
router.post('/subscribe', async (req, res) => {
    const { userId, courseId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        if (!user.subscribedCourses.includes(courseId)) {
            user.subscribedCourses.push(courseId);
            await user.save();
        }

        const updatedUser = await User.findById(userId).populate('subscribedCourses');
        res.status(200).json(updatedUser.subscribedCourses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
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


module.exports = router;
