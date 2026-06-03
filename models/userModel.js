const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
{
    username: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    },

    privacyPolicyConsent: {
        type: Boolean,
        default: false
    },

    termsOfServiceConsent: {
        type: Boolean,
        default: false
    },

    marketingConsent: {
        type: Boolean,
        default: false
    },

    aiProcessingConsent: {
        type: Boolean,
        default: false
    },

    isDeleted: {
        type: Boolean,
        default: false
    },
    
    refreshToken: {
    type: String,
    default: null
},
},
{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);