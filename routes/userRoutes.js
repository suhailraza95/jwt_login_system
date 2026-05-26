const express = require('express');
const router = express.Router();

const {registerUser,
    verifyEmailOtp,
    loginUser,
    currentUser
} = require('../controllers/usercontroller');
const registerUserREQSchema = require("../schema/request-schema/create-user-schema")
const validateDto = require("../middleware/validate-dto")
const verifyOtpREQSchema = require("../schema/request-schema/verify-otp-schema")
const loginUserREQSchema = require("../schema/request-schema/login-user-schema")

router.post("/register",
    validateDto(registerUserREQSchema),
    registerUser);

    router.post("/verifyotp",
    validateDto(verifyOtpREQSchema),
    verifyEmailOtp);

    router.post("/login",
    validateDto(loginUserREQSchema),
    loginUser);

    module.exports = router;