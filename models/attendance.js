const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);

module.exports = Attendance;
