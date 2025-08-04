const express = require("express");
const { AddExpenses, GetMonthlyExpenses, deleteExpense } = require("../../controllers/expenseController");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const router = express.Router();

router.get('/',isLoggedIn,GetMonthlyExpenses);
router.post('/add-expenses',isLoggedIn,AddExpenses);
router.post('/delete/:id', isLoggedIn, deleteExpense)

module.exports=router