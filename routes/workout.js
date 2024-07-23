const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Workout = require('../models/workout'); // Adjust the path as necessary
const Course = require('../models/courses'); // Adjust the path as necessary

// Create a new workout
router.post('/', async (req, res) => {
    const { name, description, video } = req.body;

    try {
        const newWorkout = new Workout({
            name,
            description,
            video
        });

        const workout = await newWorkout.save();
        res.status(201).json(workout);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
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
        const updatedWorkout = await Workout.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedWorkout) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.json(updatedWorkout);
    } catch (error) {
        console.error('Error updating workout:', error);
        res.status(500).send('Server error');
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
