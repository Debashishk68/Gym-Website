const express = require('express');
const isLoggedIn = require('../../middlewares/isLoggedIn');
const { addSuppliment, getAllSupplements, deleteSupplement, updateSupplement, getSupplementById, sellSupplement } = require('../../controllers/supplimentController');
const router = express.Router();


router.get('/',isLoggedIn,getAllSupplements);
router.post('/add',isLoggedIn,addSuppliment);
router.get('/:id',isLoggedIn,getSupplementById);
router.post('/delete/:id',isLoggedIn,deleteSupplement);
router.post('/edit/:id',isLoggedIn,updateSupplement);
router.post('/sell-supplement',isLoggedIn,sellSupplement);



module.exports = router;
