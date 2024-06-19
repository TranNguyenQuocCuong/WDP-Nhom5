const mongoose = require('mongoose');

const RevenueSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    coachId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coach'
    }
});

const Revenue = mongoose.model('Revenue', RevenueSchema);

module.exports = Revenue;
