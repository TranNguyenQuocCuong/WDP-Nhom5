const mongoose = require('mongoose');
const { Schema } = mongoose;

const WorkoutSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    video: {
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
