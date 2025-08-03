import React, { useState } from "react";
import {
  FaRupeeSign,
  FaClipboardList,
  FaCalendarAlt,
  FaAlignLeft,
} from "react-icons/fa";
import bgImage from "../../assets/sushil-ghimire.jpg";
import SupplementsNavbar from "../../components/SupplimentNavbar.jsx";
import Navbar from "../../components/NavBar.jsx";
import { useGetExpenses } from "../../hooks/useExpenses.js";

const MonthlyExpenses = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");

  const month = 2; // August (1-indexed for user, 0-indexed if you're handling it in backend)
  const year = 2025;

  const { data: expenses = [], isLoading, isError } = useGetExpenses(month, year);

  const categories = ["All", ...new Set(expenses.map(e => e.category))];

  const filteredExpenses = expenses.filter((expense) => {
    const matchCategory =
      selectedCategory === "All" || expense.category === selectedCategory;
    const matchDate =
      selectedDate === "" || expense.date === selectedDate;
    return matchCategory && matchDate;
  });

  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

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
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          Monthly Expenses - August 2025
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

          <input
            type="date"
            className="bg-zinc-900 text-white p-2 rounded-md border border-zinc-700"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
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
                key={expense.id}
                className="p-4 bg-zinc-900 border border-zinc-700 rounded-lg shadow-md"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
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
                    <span>{expense.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaAlignLeft className="text-yellow-400" />
                    <span className="italic">{expense.note}</span>
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
