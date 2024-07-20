const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    weight: {
        type: String,
        required: true
    },
    height: {
        type: String,
        required: true
    }
});

const Progress = mongoose.model('Progress', ProgressSchema);

module.exports = Progress;
