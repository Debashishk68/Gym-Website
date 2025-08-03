import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  FaRupeeSign,
  FaClipboardList,
  FaCalendarAlt,
  FaAlignLeft,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import bgImage from "../../assets/sushil-ghimire.jpg";
import { useAddExpense } from "../../hooks/useExpenses.js";
import NotLoggedIn from "../../components/NotLogin.jsx";
import SupplementsNavbar from "../../components/SupplimentNavbar.jsx"; // or use a separate navbar
import Navbar from "../../components/NavBar.jsx";
import { InputField } from "../../components/InputField.jsx";

const AddExpense = () => {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: "",
    note: "",
  });

  const [errors, setErrors] = useState({});
  const {
    mutate: addExpense,
    isSuccess,
    isError,
    error,
    isPending,
  } = useAddExpense();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Expense added successfully!");
      setFormData({ amount: "", category: "", date: "", note: "" });
    }
    if (isError) {
      toast.error(error.message || "Failed to add expense.");
    }
  }, [isSuccess, isError, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isError && error.message === "Login failed") {
    return <NotLoggedIn />;
  }

  const validate = () => {
    const err = {};
    if (!formData.amount) err.amount = "Amount is required";
    if (!formData.category) err.category = "Category is required";
    if (!formData.date) err.date = "Date is required";
    if (!formData.note) err.note = "Note is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    addExpense(formData);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Navbar/>
      <ToastContainer position="top-right" />
      <div className="max-w-3xl mx-auto mt-6 bg-black/80 backdrop-blur-md text-white p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
          Add Expense
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Amount (₹)"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              error={errors.amount}
              icon={<FaRupeeSign />}
              placeholder="500"
              type="number"
            />
            <InputField
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              error={errors.category}
              icon={<FaClipboardList />}
              placeholder="Snacks, Rent, Equipment..."
            />
            <InputField
              label="Date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              error={errors.date}
              icon={<FaCalendarAlt />}
              type="date"
            />
            <InputField
              label="Note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              error={errors.note}
              icon={<FaAlignLeft />}
              placeholder="Monthly electricity bill"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-lg transition"
            disabled={isPending}
          >
            {isPending ? "Adding..." : "Add Expense"}
          </button>     
        </form>
      </div>
    </div>
  );
};


export default AddExpense;
