const express = require('express');
const isLoggedIn  = require('../../middlewares/isLoggedIn');
const { addClient, dashboard, members, membersInfo, revenueChart, editClient, addPlan, getPlans, deleteClient } = require('../../controllers/userController');
const upload = require('../../middlewares/upload');
const { generateCertificateHandler } = require('../../controllers/certificateController');
const { getInvoices, generateInvoicePdf } = require('../../controllers/InvoiceController');
const router = express.Router();

router.get('/',isLoggedIn,dashboard);
router.post('/add-profile', isLoggedIn,upload.single('file'), addClient);
router.post('/add-plan',isLoggedIn,addPlan)
router.get('/get-plans',isLoggedIn,getPlans)

router.post('/update-profile/:id', isLoggedIn,upload.single('file'), editClient);
router.get('/members', isLoggedIn, members);
router.get('/membersinfo/:id', isLoggedIn, membersInfo);
router.get('/revenue-chart',isLoggedIn,revenueChart);
router.get('/get-invoices',isLoggedIn,getInvoices)

router.post('/invoice-generate',isLoggedIn,generateInvoicePdf);
router.post('/delete/:id',isLoggedIn,deleteClient)


module.exports = router;
