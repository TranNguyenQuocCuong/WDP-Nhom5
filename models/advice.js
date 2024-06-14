const mongoose = require('mongoose');

const AdviceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coachId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coach',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Advice = mongoose.model('Advice', AdviceSchema);

module.exports = Advice;
