const express = require('express');
const { login, register, logout, resetPassword } = require('../../controllers/authController');
const router = express.Router();
const path = require('path');
const { sendOtp, verifyOtp } = require('../../controllers/OtpController');



router.post('/login', login);
router.post('/register',  register);
router.post('/send-otp',sendOtp);
router.post('/verify-otp',verifyOtp);
router.post('/reset-password',resetPassword)
router.post('/logout', logout)

module.exports=router;