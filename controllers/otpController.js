const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const Otp = require('../models/otpModel');



// VERIFY EMAIL OTP
const verifyEmailOtp = asyncHandler(async (req, res) => {

    const {
        email,
        otp
    } = req.body;


    // REQUIRED FIELDS
    if (!email || !otp) {
        res.status(400);
        throw new Error("Email and OTP are required");
    }


    // FIND USER
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }


    // CHECK IF ALREADY VERIFIED
    if (user.isEmailVerified) {
        res.status(400);
        throw new Error("Email already verified");
    }


    // GET LATEST OTP
    const existingOtp = await Otp.findOne({
        userId: user._id,
        purpose: 'EMAIL_VERIFICATION',
        isUsed: false
    }).sort({ createdAt: -1 });


    if (!existingOtp) {
        res.status(404);
        throw new Error("OTP not found");
    }


    // CHECK OTP EXPIRY
    if (existingOtp.expiresAt < new Date()) {
        res.status(400);
        throw new Error("OTP has expired");
    }


    // CHECK ATTEMPTS
    if (existingOtp.attempts >= 5) {
        res.status(400);
        throw new Error("Maximum OTP attempts exceeded");
    }


    // COMPARE OTP
    const isOtpMatched = await bcrypt.compare(
        otp,
        existingOtp.otpHash
    );


    // INCREASE ATTEMPTS IF WRONG
    if (!isOtpMatched) {

        existingOtp.attempts += 1;
        await existingOtp.save();

        res.status(400);
        throw new Error("Invalid OTP");
    }


    // MARK OTP AS USED
    existingOtp.isUsed = true;
    await existingOtp.save();


    // VERIFY USER EMAIL
    user.isEmailVerified = true;
    await user.save();


    // RESPONSE
    res.status(200).json({
        message: "Email verified successfully"
    });

});


module.exports = {
    verifyEmailOtp
};