import React, { useState, useMemo } from "react";
import {
  FaRupeeSign,
  FaClipboardList,
  FaCalendarAlt,
  FaAlignLeft,
  FaTrash, // ✅ New import
} from "react-icons/fa";
import bgImage from "../../assets/sushil-ghimire.jpg";
import Navbar from "../../components/NavBar";
import { useDeleteExpense, useGetExpenses } from "../../hooks/useExpenses.js";
import { Link } from "react-router-dom";
import months from "../../utils/months.js";

const today = new Date();
const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
const currentYear = today.getFullYear();

const MonthlyExpenses = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const {
    data: expenses = [],
    isLoading,
    isError,
  } = useGetExpenses(month, year);

  const { mutate: deleteExpense } = useDeleteExpense();

  const categories = useMemo(
    () => ["All", ...new Set(expenses.map((e) => e.category))],
    [expenses]
  );


  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchCategory =
        selectedCategory === "All" || expense.category === selectedCategory;
      return matchCategory;
    });
  }, [expenses, selectedCategory]);

  const handleDeleteExpense = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
       deleteExpense(id, {
      onSuccess: () => {
        refetch(); // fetch fresh data
      },
    });
    }
  };  

  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i); // Last 5 years

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        Loading expenses...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-black text-red-400 flex justify-center items-center">
        Failed to load expenses.
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Navbar />
      <div className="max-w-4xl mx-auto mt-6 bg-black/80 backdrop-blur-md text-white p-8 rounded-xl shadow-xl">
        <div className="flex justify-end mb-4">
          <Link
            to="/add-expense"
            className="inline-block px-4 py-2 text-sm font-semibold text-yellow-500 border border-yellow-400 rounded-md hover:bg-yellow-400 hover:text-white transition-all duration-200"
          >
            + Add New Expense
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          Expenses - {months.find((m) => m.value === month)?.label} {year}
        </h2>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
          <select
            className="bg-zinc-900 text-white p-2 rounded-md border border-zinc-700"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="bg-zinc-900 text-white p-2 rounded-md border border-zinc-700"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <select
            className="bg-zinc-900 text-white p-2 rounded-md border border-zinc-700"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Total */}
        <div className="text-lg mb-4 text-center">
          <span className="text-yellow-300 font-semibold">Total:</span> ₹{total}
        </div>

        {/* Expense Cards */}
        <div className="grid gap-4">
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((expense) => (
              <div
                key={expense._id}
                className="p-4 bg-zinc-900 border border-zinc-700 rounded-lg shadow-md relative group"
              >
                {/* Delete Icon */}
                <button
                  onClick={() => handleDeleteExpense(expense._id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-opacity opacity-0 group-hover:opacity-100"
                  title="Delete Expense"
                >
                  <FaTrash size={18} />
                </button>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FaRupeeSign className="text-yellow-400" />
                    <span className="font-bold text-lg">₹{expense.amount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClipboardList className="text-yellow-400" />
                    <span>{expense.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-yellow-400" />
                    <span>{expense.date.split("T")[0]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaAlignLeft className="text-yellow-400" />
                    <span className="italic">{expense.note || "No note"}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-300">No expenses found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyExpenses;
