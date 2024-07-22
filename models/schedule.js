const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coach'
    },
    dailyWorkouts: [{
        date: {
            type: Date,
            required: true
        },
        workouts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workout'
        }],
        status: {
            type: Boolean,
            required: true
        }
    }]
});

const Schedule = mongoose.model('Schedule', ScheduleSchema);

module.exports = Schedule;
