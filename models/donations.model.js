const { Schema, model } = require('mongoose');

const donationSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Donation', donationSchema);