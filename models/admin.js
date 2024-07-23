const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
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
        required: true
    }
});

// Middleware to hash password before saving
// AdminSchema.pre('save', function (next) {
//     const admin = this;
//     if (!admin.isModified('password')) return next();

//     bcrypt.genSalt(10, (err, salt) => {
//         if (err) return next(err);

//         bcrypt.hash(admin.password, salt, (err, hash) => {
//             if (err) return next(err);
//             admin.password = hash;
//             next();
//         });
//     });
// });

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
