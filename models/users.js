const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
