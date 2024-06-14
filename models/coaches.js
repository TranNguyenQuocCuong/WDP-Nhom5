// models/coaches.js

const mongoose = require('mongoose');

const CoachSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    age: {
        type: Number
    },
    advisedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const Coach = mongoose.model('Coach', CoachSchema);

module.exports = Coach;
