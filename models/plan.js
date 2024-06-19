const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const Plan = mongoose.model('Plan', PlanSchema);

module.exports = Plan;
