const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Workout = require('../models/workout'); // Adjust the path as necessary
const Course = require('../models/courses'); // Adjust the path as necessary

// Create a new workout
router.post('/', async (req, res) => {
    try {
        const { name, video, description, courseId } = req.body;

        // Check if the provided courseId exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const workout = new Workout({ name, video, description, courseId });
        await workout.save();
        res.status(201).json(workout);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all workouts
router.get('/', async (req, res) => {
    try {
        const workouts = await Workout.find().populate('courseId', 'name');
        res.status(200).json(workouts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific workout by ID
router.get('/:id', async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id).populate('courseId', 'name');
        if (!workout) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.status(200).json(workout);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a workout by ID
router.put('/:id', async (req, res) => {
    try {
        const { name, video, description, courseId } = req.body;

        // Check if the provided courseId exists
        if (courseId) {
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }
        }

        const workout = await Workout.findByIdAndUpdate(
            req.params.id,
            { name, video, description, courseId },
            { new: true }
        );

        if (!workout) {
            return res.status(404).json({ message: 'Workout not found' });
        }

        res.status(200).json(workout);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a workout by ID
router.delete('/:id', async (req, res) => {
    try {
        const workout = await Workout.findByIdAndDelete(req.params.id);
        if (!workout) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.status(200).json({ message: 'Workout deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
