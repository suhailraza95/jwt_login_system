const express = require('express');
const router = express.Router();

const {registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser
} = require('../controllers/authController');
const registerUserREQSchema = require("../schema/request-schema/create-user-schema")
const validateDto = require("../middleware/validate-dto")
const loginUserREQSchema = require("../schema/request-schema/login-user-schema")
const refreshTokenREQSchema = require("../schema/request-schema/refresh-token-schema")

router.post("/register",
    validateDto(registerUserREQSchema),
    registerUser);

    router.post("/login",
    validateDto(loginUserREQSchema),
    loginUser);

    router.post("/refresh-token",
    validateDto(refreshTokenREQSchema),
    refreshAccessToken);

    router.post("/logout",
    logoutUser);

    module.exports = router;