const express = require('express');
const router = express.Router();
const Workout = require('../models/workout');
const { authenticateToken } = require('../middlewares/authen');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const workouts = await Workout.find();
        res.json(workouts);
    } catch (error) {
        console.error('Error fetching workouts:', error);
        res.status(500).send('Server error');
    }
});

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

router.put('/:workoutId', async (req, res) => {
    try {
        const updatedWorkout = await Workout.findByIdAndUpdate(
            req.params.workoutId,
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

router.delete('/:workoutId', async (req, res) => {
    try {
        const deletedWorkout = await Workout.findByIdAndDelete(req.params.workoutId);
        if (!deletedWorkout) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.json({ message: 'Workout deleted successfully' });
    } catch (error) {
        console.error('Error deleting workout:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;