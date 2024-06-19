const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const Workout = mongoose.model('Workout', WorkoutSchema);

module.exports = Workout;
