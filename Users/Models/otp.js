const mongoose = require('mongoose');
const { Schema } = mongoose;

const otpSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: Number,
        required: true
    },
    createdAt: { 
        type: Date,
        default: Date.now,
        expires: 120
    }
});

const OTPModel = mongoose.model('otp', otpSchema);

module.exports = OTPModel;
