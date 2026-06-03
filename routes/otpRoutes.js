const express = require('express');
const router = express.Router();

const {
    verifyEmailOtp
} = require('../controllers/otpController');

const validateDto = require("../middleware/validate-dto")
const verifyOtpREQSchema = require("../schema/request-schema/verify-otp-schema")

 router.post("/verifyotp",
    validateDto(verifyOtpREQSchema),
    verifyEmailOtp);

    module.exports = router;