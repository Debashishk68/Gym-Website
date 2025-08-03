import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  FaDumbbell,
  FaMoneyBill,
  FaBox,
  FaBalanceScale,
  FaBuilding,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import bgImage from "../../assets/sushil-ghimire.jpg";
import { useAddSuppliment } from "../../hooks/useSuppliment.js";
import NotLoggedIn from "../../components/NotLogin.jsx";
import SupplementsNavbar from "../../components/SupplimentNavbar.jsx";
import { InputField } from "../../components/InputField.jsx";

const AddSupplement = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    weight: "",
    company: "",
  });

  const [errors, setErrors] = useState({});
  const { mutate: addSuppliment, isSuccess, isError, error, isPending } = useAddSuppliment();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Supplement added successfully!");
      setFormData({ name: "", price: "", stock: "", weight: "", company: "" });
    }
    if (isError) {
      toast.error(error.message || "Failed to add supplement.");
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
    if (!formData.name) err.name = "Name is required";
    if (!formData.price) err.price = "Price is required";
    if (!formData.stock) err.stock = "Stock is required";
    if (!formData.weight) err.weight = "Weight is required";
    if (!formData.company) err.company = "Company is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    addSuppliment(formData); // call mutation
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <SupplementsNavbar />
      <ToastContainer position="top-right" />
      <div className="max-w-4xl mx-auto mt-6 bg-black/80 backdrop-blur-md text-white p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
          Add New Supplement
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Supplement Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              icon={<FaDumbbell />}
              placeholder="Whey Protein"
            />
            <InputField
              label="Price (₹)"
              name="price"
              value={formData.price}
              onChange={handleChange}
              error={errors.price}
              type="number"
              icon={<FaMoneyBill />}
              placeholder="1499"
            />
            <InputField
              label="Stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              error={errors.stock}
              type="number"
              icon={<FaBox />}
              placeholder="25"
            />
            <InputField
              label="Weight (g/kg)"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              error={errors.weight}
              icon={<FaBalanceScale />}
              placeholder="1kg"
            />
            <InputField
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              error={errors.company}
              icon={<FaBuilding />}
              placeholder="MuscleBlaze"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-lg transition"
            disabled={isPending}
          >
            {isPending ? "Adding..." : "Add Supplement"}
          </button>
        </form>
      </div>
    </div>
  );
};



export default AddSupplement;
