const express = require('express');
const isLoggedIn = require('../../middlewares/isLoggedIn');
const { addSuppliment, getAllSupplements, deleteSupplement, updateSupplement, getSupplementById, sellSupplement, sellingData } = require('../../controllers/supplimentController');
const { generateSupplementInvoicePdf } = require('../../controllers/InvoiceController');
const router = express.Router();


router.get('/',isLoggedIn,getAllSupplements);
router.post('/add',isLoggedIn,addSuppliment);
router.get('/:id',isLoggedIn,getSupplementById);
router.post('/delete/:id',isLoggedIn,deleteSupplement);
router.post('/edit/:id',isLoggedIn,updateSupplement);
router.post('/sell-supplement',isLoggedIn,sellSupplement);
router.post('/sell-supplement-pdf/:id',isLoggedIn,generateSupplementInvoicePdf)
router.get("/data/selling",isLoggedIn,sellingData)



module.exports = router;
