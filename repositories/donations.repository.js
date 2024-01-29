const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
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

const Donation = mongoose.model('Donation', donationSchema);

module.exports = {Donation};
