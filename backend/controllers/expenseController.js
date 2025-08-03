const Expense = require("../models/expenseModel");

// Add a new expense
const AddExpenses = async (req, res) => {
  const { amount, category, note, date } = req.body;

  if (!amount || !category || !note || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const parsedDate = new Date(date);

  if (isNaN(parsedDate)) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  try {
    const newExpense = new Expense({
      amount,
      category,
      note,
      date: parsedDate,
      createdBy: req.user?.id || req.id?.user,
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error("Error saving expense:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all expenses for a specific month and year
const GetMonthlyExpenses = async (req, res) => {
  const { month, year } = req.query; // GET /api/expenses?month=08&year=2025

  if (!month || !year) {
    return res.status(400).json({ message: "Month and year are required" });
  }

  const startDate = new Date(`${year}-${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);
 
  try {
    const expenses = await Expense.find({
      date: { $gte: startDate, $lt: endDate },
      createdBy: req.user?.id || req.id?.user,
    }).sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  AddExpenses,
  GetMonthlyExpenses,
};
