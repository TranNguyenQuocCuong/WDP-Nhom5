const mongoose = require('mongoose');

const RevenueSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    planId: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Revenue = mongoose.model('Revenue', RevenueSchema);

module.exports = Revenue;
