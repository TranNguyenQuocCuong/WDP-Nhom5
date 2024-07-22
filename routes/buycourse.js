const express = require('express');
const router = express.Router();
const Course = require('../models/courses');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { authenticateToken } = require('../middlewares/authen');

// Route to get all courses
router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to get a single course by ID
router.get('/courses/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;