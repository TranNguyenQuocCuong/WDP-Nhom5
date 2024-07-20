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
    timeStartMinute: {
        type: String,
        required: true
    },
    timeStartHour: {
        type: String,
        required: true
    },
    timeEndMinute: {
        type: String,
        required: true
    },
    timeEndHour: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);

module.exports = Attendance;
