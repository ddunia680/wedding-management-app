const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const guestSchema = Schema({
    profileUrl: String,
    name: {
        type: String,
        required: true
    },
    phoneNo: {
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
    },
    inside: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Guest', guestSchema);