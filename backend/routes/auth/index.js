const express = require('express');
const { login, register, logout } = require('../../controllers/authController');
const router = express.Router();
const path = require('path')



router.post('/login', login);
router.post('/register',  register)
router.post('/logout', logout)

module.exports=router;