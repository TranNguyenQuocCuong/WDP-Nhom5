// models/users.js
const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    }
});

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;
