const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adminSchema = Schema({
    profileUrl: String,
    email: {
        type: String,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);