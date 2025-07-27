import React, { useState, useMemo } from "react";
import Navbar from "../../components/NavBar";
import { toast } from "react-toastify";
import {
  useGetAllSuppliments,
  useSellSupppliment,
} from "../../hooks/useSuppliment";

const SellSupplement = () => {
  const { data: supplementsData, isSuccess, isLoading, isError } =
    useGetAllSuppliments();

  const { mutate: sellSupplement, isPending } = useSellSupppliment();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    supplement: "",
    quantity: "",
    weight: "",
    company: "",
    paymentMode: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const selectedSupplement = useMemo(() => {
    if (!isSuccess) return null;
    return supplementsData.data.find(
      (s) => s.name === formData.supplement
    );
  }, [formData.supplement, supplementsData, isSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedSupplement) {
      toast.error("Please select a supplement");
      return;
    }

    if (+formData.quantity > selectedSupplement.stock) {
      toast.error("Quantity exceeds available stock!");
      return;
    }

    const payload = {
      customerName: formData.name,
      mobileNumber: formData.mobile,
      email: formData.email,
      weight: formData.weight,
      company: formData.company,
      supplementName: formData.supplement,
      supplementId: selectedSupplement._id,
      quantity: +formData.quantity,
      paymentMode: formData.paymentMode,
    };

    sellSupplement(payload, {
      onSuccess: () => {
        toast.success("Supplement sold successfully!");
        setFormData({
          name: "",
          mobile: "",
          email: "",
          supplement: "",
          quantity: "",
          weight: "",
          company: "",
          paymentMode: "",
        });
      },
      onError: (error) => {
        toast.error(error?.message || "Failed to sell supplement");
      },
    });
  };

  const supplementOptions = isSuccess
    ? supplementsData?.data.map((supp) => (
        <option key={supp._id} value={supp.name}>
          {supp.name}
        </option>
      ))
    : [];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white px-4 md:px-20 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center text-[#fdc700]">
          Sell Supplement
        </h1>

        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-zinc-900 rounded-2xl shadow-xl p-8 space-y-6"
        >
          {/* Text Inputs */}
          {[
            { label: "Customer Name", name: "name", type: "text" },
            { label: "Mobile Number", name: "mobile", type: "text" },
            { label: "Email Address", name: "email", type: "email" },
            { label: "Weight (kg)", name: "weight", type: "text" },
            { label: "Company", name: "company", type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-sm mb-1 text-gray-300">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          ))}

          {/* Supplement Dropdown */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Supplement Name</label>
            <select
              name="supplement"
              value={formData.supplement}
              onChange={handleChange}
              required
              disabled={isLoading || isError}
              className="w-full px-4 py-3 bg-zinc-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">
                {isLoading
                  ? "Loading supplements..."
                  : isError
                  ? "Failed to load supplements"
                  : "Select Supplement"}
              </option>
              {supplementOptions}
            </select>

            {selectedSupplement && (
              <p className="text-sm text-gray-400 mt-1">
                Available stock:{" "}
                <span className="text-yellow-400">{selectedSupplement.stock}</span>
              </p>
            )}
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min={1}
              max={selectedSupplement?.stock || 1000}
              className="w-full px-4 py-3 bg-zinc-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Mode of Payment</label>
            <select
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-zinc-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select Payment Mode</option>
              <option value="cash">Cash</option>
              <option value="online">Online</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-6 bg-[#fdc700] hover:bg-yellow-300 text-black font-bold py-3 rounded-lg transition transform hover:scale-[1.02] disabled:opacity-50"
          >
            {isPending ? "Processing..." : "Sell Now"}
          </button>
        </form>
      </div>
    </>
  );
};

export default SellSupplement;
