// models/users.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    name: {
        type: String
    },
    address: {
        type: String
    },
    gender: {
        type: String
    },
    age: {
        type: Number
    },
    subscribedCoach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coach'
    },
    remainingTime: {
        type: String
    },

    subscribedCourses: [{  // Thêm field subscribedCourses vào schema
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
