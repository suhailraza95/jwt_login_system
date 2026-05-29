const asyncHandler = require('express-async-handler');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const generateToken = require('../resources/generateToken');
const Otp = require('../models/otpModel');

const { sendOtpEmail } = require('../services/mailService');


// REGISTER USER
const registerUser = asyncHandler(async (req, res) => {

    const {
        username,
        email,
        password,
        privacyPolicyConsent,
        termsOfServiceConsent,
        marketingConsent,
        aiProcessingConsent
    } = req.body;


    // REQUIRED FIELDS
    if (
        !username ||
        !email ||
        !password ||
        privacyPolicyConsent === undefined ||
        termsOfServiceConsent === undefined ||
        marketingConsent === undefined ||
        aiProcessingConsent === undefined
    ) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }


    // USERNAME VALIDATION
    if (username.trim().length < 3) {
        res.status(400);
        throw new Error("Please provide a valid username");
    }


    // EMAIL VALIDATION
    const isValidEmail = validator.isEmail(email);

    if (!isValidEmail) {
        res.status(400);
        throw new Error("Please provide a valid email");
    }


    // PASSWORD VALIDATION
    const isStrongPassword = validator.isStrongPassword(password);

    if (!isStrongPassword) {
        res.status(400);
        throw new Error("Please provide a strong password");
    }


    // REQUIRED CONSENTS
    if (!privacyPolicyConsent) {
        res.status(400);
        throw new Error("Privacy policy consent is required");
    }

    if (!termsOfServiceConsent) {
        res.status(400);
        throw new Error("Terms of service consent is required");
    }

    if (!aiProcessingConsent) {
        res.status(400);
        throw new Error("AI processing consent is required");
    }


    // CHECK EXISTING USER
    const userExists = await User.findOne({ email });

    if (userExists) {

        // USER ALREADY VERIFIED
        if (userExists.isEmailVerified) {
            res.status(400);
            throw new Error("User already exists");
        }

        // USER EXISTS BUT EMAIL NOT VERIFIED

        // GENERATE NEW OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // HASH OTP
        const otpHash = await bcrypt.hash(otp, 10);

        // EXPIRY = 24 HOURS
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // DELETE OLD OTPs
        await Otp.deleteMany({
            userId: userExists._id,
            purpose: 'EMAIL_VERIFICATION'
        });

        // SAVE NEW OTP
        await Otp.create({
            userId: userExists._id,
            email: userExists.email,
            otpHash,
            purpose: 'EMAIL_VERIFICATION',
            expiresAt
        });

        // SEND OTP EMAIL
        await sendOtpEmail(userExists.email, otp);
       // console.log("account exists otp: ", otp)
        return res.status(200).json({
            message: "Account exists but email is not verified. A new OTP has been sent.",
            userId: userExists._id,
            email: userExists.email
        });
    }


    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);


    // CREATE USER
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        privacyPolicyConsent,
        termsOfServiceConsent,
        marketingConsent,
        aiProcessingConsent,
        isEmailVerified: false
    });


    // GENERATE OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();


    // HASH OTP
    const otpHash = await bcrypt.hash(otp, 10);


    // EXPIRY = 24 HOURS
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);


    // SAVE OTP
    await Otp.create({
        userId: user._id,
        email: user.email,
        otpHash,
        purpose: 'EMAIL_VERIFICATION',
        expiresAt
    });


    // SEND OTP EMAIL
    await sendOtpEmail(user.email, otp);
    //console.log(otp)

    // RESPONSE
    res.status(201).json({
        message: "User registered successfully. OTP sent to email.",
        userId: user._id,
        email: user.email
    });

});

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

// LOGIN USER
const loginUser = asyncHandler(async (req, res) => {

    const {
        email,
        password
    } = req.body;


    // REQUIRED FIELDS
    if (!email || !password) {
        res.status(400);
        throw new Error("Email and password are required");
    }


    // EMAIL VALIDATION
    const isValidEmail = validator.isEmail(email);

    if (!isValidEmail) {
        res.status(400);
        throw new Error("Please provide a valid email");
    }


    // FIND USER
    const user = await User.findOne({
        email,
        isDeleted: false
    });


    // CHECK USER EXISTS
    if (!user) {
        res.status(401);
        throw new Error("Invalid email or password");
    }


    // CHECK EMAIL VERIFIED
    if (!user.isEmailVerified) {
        res.status(401);
        throw new Error("Please verify your email before login");
    }


    // CHECK PASSWORD
    const isPasswordMatched = await bcrypt.compare(
        password,
        user.password
    );


    if (!isPasswordMatched) {
        res.status(401);
        throw new Error("Invalid email or password");
    }


    // GENERATE JWT TOKEN
    const token = generateToken(user._id);


    // RESPONSE
    res.status(200).json({
        message: "Login successful",

        token,

        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            isEmailVerified: user.isEmailVerified
        }
    });

});

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
    registerUser,
    verifyEmailOtp,
    loginUser,
    forgotPassword,
    resetPassword

};