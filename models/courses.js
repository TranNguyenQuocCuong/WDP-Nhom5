const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    action: {
        type: Boolean,
        required: true
    },
    workouts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workout'
    }],
    coaches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coach'
    }]
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
