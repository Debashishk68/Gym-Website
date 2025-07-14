const express = require('express');
const isLoggedIn  = require('../../middlewares/isLoggedIn');
const { addClient, dashboard, members, membersInfo, revenueChart } = require('../../controllers/userController');
const upload = require('../../middlewares/upload');
const router = express.Router();

router.get('/',isLoggedIn,dashboard);
router.post('/add-profile', isLoggedIn,upload.single('file'), addClient);
router.get('/members', isLoggedIn, members);
router.get('/membersinfo/:id', isLoggedIn, membersInfo);
router.get('/revenue-chart',isLoggedIn,revenueChart)

module.exports = router;
