const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { default: FacebookLoginRender } = require('react-facebook-login/dist/facebook-login-render-props');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        unique: true,
        required: true
    },
    FacebookId: String,
    email:{
        type: String,
        required: true
    }
});

// // Băm mật khẩu trước khi lưu
// UserSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         return next();
//     }
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

const User = mongoose.model('User', UserSchema);

module.exports = User;
