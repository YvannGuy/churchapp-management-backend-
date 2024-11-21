const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    type: {
        type: String,
        enum: ['TITHES', 'OFFERING', 'THANKSGIVING'],
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

module.exports = mongoose.model('Donation', donationSchema);
