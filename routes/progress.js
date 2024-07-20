const express = require('express');
const router = express.Router();
const Progress = require('../models/progress');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/:userId/progress', authenticateToken, async (req, res) => {
    try {
        const progress = await Progress.findOne({ userId: req.params.userId });
        if (!progress) return res.status(404).json({ message: 'Progress not found' });
        res.json(progress);
    } catch (error) {
        console.error('Error fetching user progress:', error);
        res.status(500).send('Server error');
    }
});

router.put('/:userId/progress', authenticateToken, async (req, res) => {
    const { weight, height} = req.body;
    try {
        const progress = await Progress.findOneAndUpdate(
            { userId: req.params.userId },
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
