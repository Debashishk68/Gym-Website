const express = require("express");
const { AddExpenses, GetMonthlyExpenses } = require("../../controllers/expenseController");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const router = express.Router();

router.get('/',isLoggedIn,GetMonthlyExpenses);
router.post('/add-expenses',isLoggedIn,AddExpenses)

module.exports=router