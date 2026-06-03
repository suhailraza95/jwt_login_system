const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const User = require('../models/userModel');
const Otp = require('../models/otpModel');

const { sendOtpEmail } = require('../services/mailService');



const forgotPassword = asyncHandler(async (req, res) => {

    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error("Email is required");
    }

    const user = await User.findOne({
        email,
        isDeleted: false
    });

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Remove old reset OTPs
    await Otp.deleteMany({
        userId: user._id,
        purpose: 'PASSWORD_RESET'
    });

    const otp = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    const otpHash = await bcrypt.hash(otp, 10);

    const expiresAt = new Date(
        Date.now() + 24 * 60 * 60 * 1000
    );

    await Otp.create({
        userId: user._id,
        email: user.email,
        otpHash,
        purpose: 'PASSWORD_RESET',
        expiresAt
    });

    await sendOtpEmail(user.email, otp);

    res.status(200).json({
        message: "Password reset OTP sent successfully"
    });

});


const resetPassword = asyncHandler(async (req, res) => {

    const {
        email,
        otp,
        newPassword
    } = req.body;


    // REQUIRED FIELDS
    if (!email || !otp || !newPassword) {
        res.status(400);
        throw new Error(
            "Email, OTP and new password are required"
        );
    }


    // EMAIL VALIDATION
    if (!validator.isEmail(email)) {
        res.status(400);
        throw new Error("Please provide a valid email");
    }


    // PASSWORD VALIDATION
    if (!validator.isStrongPassword(newPassword)) {
        res.status(400);
        throw new Error(
            "Please provide a strong password"
        );
    }


    // FIND USER
    const user = await User.findOne({
        email,
        isDeleted: false
    });

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }


    // FIND LATEST RESET OTP
    const existingOtp = await Otp.findOne({
        userId: user._id,
        purpose: 'PASSWORD_RESET',
        isUsed: false
    }).sort({ createdAt: -1 });


    if (!existingOtp) {
        res.status(404);
        throw new Error("OTP not found");
    }


    // CHECK EXPIRY
    if (existingOtp.expiresAt < new Date()) {
        res.status(400);
        throw new Error("OTP has expired");
    }


    // CHECK ATTEMPTS
    if (existingOtp.attempts >= 5) {
        res.status(400);
        throw new Error(
            "Maximum OTP attempts exceeded"
        );
    }


    // VERIFY OTP
    const isOtpMatched = await bcrypt.compare(
        otp,
        existingOtp.otpHash
    );

    if (!isOtpMatched) {

        existingOtp.attempts += 1;
        await existingOtp.save();

        res.status(400);
        throw new Error("Invalid OTP");
    }


    // HASH NEW PASSWORD
    const hashedPassword = await bcrypt.hash(
        newPassword,
        10
    );


    // UPDATE PASSWORD
    user.password = hashedPassword;
    await user.save();


    // MARK OTP USED
    existingOtp.isUsed = true;
    await existingOtp.save();


    res.status(200).json({
        message: "Password reset successfully"
    });

});


module.exports = {
    forgotPassword,
    resetPassword

};