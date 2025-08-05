import React, { useState, useEffect, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  useGetAllSuppliments,
  useGetSellingSupplimentsData,
  useSellSupppliment,
} from "../../hooks/useSuppliment.js";
import SupplementsNavbar from "../../components/SupplimentNavbar.jsx";
import { InputField } from "../../components/InputField.jsx";

const SellSupplement = () => {
  const {
    data: supplementsData,
    isSuccess,
    isLoading,
    isError,
  } = useGetAllSuppliments();

  const { data: salesData, isSuccess: isSalesSuccess } =
    useGetSellingSupplimentsData();
  const { mutate: sellSupplement, isPending } = useSellSupppliment();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    weight: "",
    paymentMode: "",
    amountPaid: "",
    supplements: [
      {
        supplement: "",
        quantity: "",
        discountPercent: "",
      },
    ],
  });

  const [previousDue, setPreviousDue] = useState(0);

  useEffect(() => {
    if (!isSalesSuccess || !formData.mobile) return;

    const matchingSales = salesData.filter(
      (sale) => sale.mobileNumber === formData.mobile
    );

    if (matchingSales.length > 0) {
      const latest = matchingSales[0];
      setFormData((prev) => ({
        ...prev,
        name: latest.customerName,
        email: latest.email,
      }));
    }

    const totalDue = matchingSales.reduce((acc, sale) => {
      const due = sale.amountDue;
      return acc + (due > 0 ? due : 0);
    }, 0);

    setPreviousDue(totalDue);
  }, [formData.mobile, isSalesSuccess, salesData]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateSupplement = (index, field, value) => {
    const updated = [...formData.supplements];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, supplements: updated }));
  };

  const addSupplement = () => {
    setFormData((prev) => ({
      ...prev,
      supplements: [
        ...prev.supplements,
        { supplement: "", quantity: "", discountPercent: "" },
      ],
    }));
  };

  const removeSupplement = (index) => {
    const updated = [...formData.supplements];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, supplements: updated }));
  };

  // 🔢 Calculate total of supplements
  const calculatedSupplementItems = formData.supplements.map((item) => {
    const selected = supplementsData?.data.find(
      (s) => s.name === item.supplement
    );
    const mrp = selected?.price || 0;
    const discount = parseFloat(item.discountPercent) || 0;
    const quantity = parseInt(item.quantity) || 0;
    const discountAmount = (mrp * discount) / 100;
    const unitPrice = mrp - discountAmount;
    const total = unitPrice * quantity;
    return { total };
  });

  const supplementTotal = calculatedSupplementItems.reduce(
    (acc, item) => acc + item.total,
    0
  );

  const totalPayable = supplementTotal + previousDue;

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const supplementItems = formData.supplements.map((item) => {
        const selected = supplementsData?.data.find(
          (s) => s.name === item.supplement
        );
        const mrp = selected?.price || 0;
        const discount = parseFloat(item.discountPercent) || 0;
        const quantity = parseInt(item.quantity) || 0;

        if (quantity > selected.stock) {
          throw new Error(`Quantity exceeds stock for ${selected.name}`);
        }

        const discountAmount = (mrp * discount) / 100;
        const unitPrice = mrp - discountAmount;
        const total = unitPrice * quantity;
        const totalDiscount = discountAmount * quantity;

        return {
          supplementId: selected._id,
          name: selected.name,
          quantity,
          mrp,
          discountPercent: discount,
          unitPrice,
          total,
          totalDiscount,
        };
      });

      const grandTotal = supplementItems.reduce(
        (acc, item) => acc + item.total,
        0
      );
      const grandDiscount = supplementItems.reduce(
        (acc, item) => acc + item.totalDiscount,
        0
      );

      const payload = {
        customerName: formData.name,
        mobileNumber: formData.mobile,
        email: formData.email,
        weight: formData.weight,
        modeOfPayment: formData.paymentMode,
        amountPaid: parseFloat(formData.amountPaid),
        amountDue: Math.max(
          grandTotal + previousDue - parseFloat(formData.amountPaid || 0),
          0
        ),
        supplements: supplementItems,
      };

      sellSupplement(payload, {
        onSuccess: () => {
          toast.success("Supplement(s) sold successfully!");
          setFormData({
            name: "",
            mobile: "",
            email: "",
            weight: "",
            paymentMode: "",
            amountPaid: "",
            supplements: [
              { supplement: "", quantity: "", discountPercent: "" },
            ],
          });
          setPreviousDue(0);
        },
        onError: (error) => {
          toast.error(error?.message || "Failed to sell supplements");
        },
      });
    } catch (error) {
      toast.error(error.message || "Error processing sale");
    }
  };

  return (
    <>
      <SupplementsNavbar />
      <ToastContainer position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black text-white px-4 md:px-20 py-12">
        <h1 className="text-4xl font-bold mb-12 text-center text-[#fdc700] drop-shadow-lg">
          Sell Supplements
        </h1>

        <form
          onSubmit={handleSubmit}
          className="max-w-6xl mx-auto bg-zinc-950 rounded-3xl shadow-2xl p-10 space-y-10 border border-zinc-800"
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <InputField
              label="Mobile Number"
              name="mobile"
              type="text"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile Number"
            />
            <InputField
              label="Customer Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Customer Name"
            />
            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <InputField
              label="Weight (kg)"
              name="weight"
              type="text"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Weight"
            />
            <div className="flex flex-col">
              <label className="mb-2 text-sm text-gray-400 font-medium">
                Payment Mode
              </label>
              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-800 text-white border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              >
                <option value="">Select Payment Mode</option>
                <option value="cash">Cash</option>
                <option value="online">Online</option>
              </select>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Supplements</h2>
            {formData.supplements.map((item, index) => {
              const selected = supplementsData?.data.find(
                (s) => s.name === item.supplement
              );
              const mrp = selected?.price || 0;
              const stock = selected?.stock || 0;
              const discount = parseFloat(item.discountPercent) || 0;
              const quantity = parseInt(item.quantity) || 0;
              const discountAmount = (mrp * discount) / 100;
              const unitPrice = mrp - discountAmount;
              const total = unitPrice * quantity;

              return (
                <div
                  key={index}
                  className="grid gap-4 grid-cols-1 md:grid-cols-5 border border-zinc-700 p-4 rounded-xl bg-zinc-900 mb-4"
                >
                  <select
                    value={item.supplement}
                    onChange={(e) =>
                      updateSupplement(index, "supplement", e.target.value)
                    }
                    required
                    className="bg-zinc-800 text-white px-3 py-2 rounded-lg border border-zinc-700"
                  >
                    <option value="">Select Supplement</option>
                    {isSuccess &&
                      supplementsData.data.map((supp) => (
                        <option key={supp._id} value={supp.name}>
                          {supp.name}
                        </option>
                      ))}
                  </select>

                  <input
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) =>
                      updateSupplement(index, "quantity", e.target.value)
                    }
                    className="bg-zinc-800 text-white px-3 py-2 rounded-lg border border-zinc-700"
                    required
                  />

                  <input
                    type="number"
                    placeholder="Discount %"
                    value={item.discountPercent}
                    onChange={(e) =>
                      updateSupplement(index, "discountPercent", e.target.value)
                    }
                    className="bg-zinc-800 text-white px-3 py-2 rounded-lg border border-zinc-700"
                  />

                  <div className="text-sm text-gray-300 mt-2">
                    <p>
                      <span className="text-yellow-400 font-medium">MRP:</span>{" "}
                      ₹{mrp}
                    </p>
                    <p>
                      <span className="text-yellow-400 font-medium">
                        Stock:
                      </span>{" "}
                      {stock}
                    </p>
                    <p>
                      <span className="text-yellow-400 font-medium">
                        Total:
                      </span>{" "}
                      ₹{total.toFixed(2)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeSupplement(index)}
                    className="text-red-500 underline text-sm mt-2"
                  >
                    Remove
                  </button>
                </div>
              );
            })}

            <button
              type="button"
              onClick={addSupplement}
              className="bg-yellow-600 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg text-sm"
            >
              + Add Supplement
            </button>
          </div>

          {/* Total Calculation Summary */}
          <div className="space-y-2 mt-6">
            {previousDue > 0 && (
              <div className="bg-red-900 text-red-200 border border-red-600 p-4 rounded-lg text-sm">
                <strong>Previous Due:</strong> ₹{previousDue.toFixed(2)}
              </div>
            )}
            <div className="bg-red-900 text-red-200 border border-red-600 p-4 rounded-lg text-sm">
              <strong>Supplement Total:</strong> ₹{supplementTotal.toFixed(2)}
            </div>
            <div className="bg-green-900 text-green-200 border border-green-600 p-4 rounded-lg text-sm font-semibold text-lg">
              <strong>Total Payable (Due + Supplements):</strong> ₹
              {totalPayable.toFixed(2)}
            </div>
          </div>

          <InputField
            label="Amount Paid"
            name="amountPaid"
            type="number"
            value={formData.amountPaid}
            onChange={handleChange}
            placeholder="Amount Paid"
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-6 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-lg py-3 rounded-xl shadow-lg transition transform hover:scale-[1.02] disabled:opacity-50"
          >
            {isPending ? "Processing..." : "Sell Now"}
          </button>
        </form>
      </div>
    </>
  );
};

export default SellSupplement;
