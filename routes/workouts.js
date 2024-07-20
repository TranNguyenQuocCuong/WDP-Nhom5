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
    const { name, description } = req.body;

    try {
        const newWorkout = new Workout({
            name,
            description
        });

        const workout = await newWorkout.save();
        res.status(201).json(workout);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;