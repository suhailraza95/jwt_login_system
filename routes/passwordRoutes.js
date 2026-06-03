const express = require('express');
const router = express.Router();

const {
    forgotPassword,
    resetPassword
} = require('../controllers/passwordController');

const forgotPasswordREQSchema = require("../schema/request-schema/forgot-password-schema")
const validateDto = require("../middleware/validate-dto")
const resetPasswordREQSchema = require("../schema/request-schema/reset-password-schema")

  router.post("/forgot-password",
    validateDto(forgotPasswordREQSchema),
    forgotPassword);

    router.post("/reset-password",
    validateDto(resetPasswordREQSchema),
    resetPassword);

        module.exports = router;