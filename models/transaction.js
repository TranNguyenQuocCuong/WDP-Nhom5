// models/Transaction.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    paymentStatus: {
        type: String,
        default: '0'
    },
    // Other fields relevant to your transaction schema
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
