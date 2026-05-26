const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    otpHash: {
        type: String,
        required: true
    },

    purpose: {
        type: String,
        enum: [
            'EMAIL_VERIFICATION',
            'LOGIN',
            'PASSWORD_RESET'
        ],
        required: true
    },

    expiresAt: {
        type: Date,
        required: true
    },

    attempts: {
        type: Number,
        default: 0
    },

    isUsed: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});

// Automatically delete expired OTP documents
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Otp', otpSchema);