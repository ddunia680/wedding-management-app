const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const guestSchema = Schema({
    profileUrl: String,
    name: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true,
        default: 'Ordinary'
    },
    status: {
        type: String,
        required: true,
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Guest', guestSchema);