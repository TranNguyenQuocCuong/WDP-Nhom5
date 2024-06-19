// models/users.js
const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
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
