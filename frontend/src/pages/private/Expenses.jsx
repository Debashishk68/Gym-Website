import React, { useState, useMemo, useEffect } from "react";
import {
  FaRupeeSign,
  FaClipboardList,
  FaCalendarAlt,
  FaAlignLeft,
  FaTrash,
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
  const [expenses, setExpenses] = useState([]);
  const [expandedExpenseId, setExpandedExpenseId] = useState(null);

  const {
    data,
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useGetExpenses(month, year);

  const { mutate: deleteExpense, isPending: isDeleting } = useDeleteExpense();

  useEffect(() => {
    if (isSuccess) {
      setExpenses(data);
    }
  }, [isSuccess, data]);

  const categories = useMemo(
    () => ["All", ...new Set(expenses.map((e) => e.category))],
    [expenses]
  );

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      return selectedCategory === "All" || expense.category === selectedCategory;
    });
  }, [expenses, selectedCategory]);

  const handleDeleteExpense = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      deleteExpense(id, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

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
            className="inline-block px-4 py-2 text-sm font-semibold text-yellow-500 border border-yellow-400 rounded-md hover:bg-yellow-400 hover:text-black transition-all duration-200"
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
            filteredExpenses.map((expense) => {
              const isExpanded = expandedExpenseId === expense._id;

              return (
                <div
                  key={expense._id}
                  className={`flex transition-all duration-300 ease-in-out ${
                    isExpanded ? "translate-x-[-60px]" : "translate-x-0"
                  }`}
                >
                  <div
                    onClick={() =>
                      setExpandedExpenseId(
                        isExpanded ? null : expense._id
                      )
                    }
                    className="flex-1 p-4 bg-zinc-900 border border-zinc-700 rounded-lg shadow-md cursor-pointer"
                  >
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
                        <span className="italic">
                          {expense.note || "No note"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  {isExpanded && (
                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="ml-2 bg-red-600 hover:bg-red-700 text-white px-3 rounded-md transition-all"
                    >
                      {isDeleting ? "Deleting..." : <FaTrash size={18} />}
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-300">No expenses found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyExpenses;
