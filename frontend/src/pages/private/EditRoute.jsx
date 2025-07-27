import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditSuppliment, useGetSupplimentId } from "../../hooks/useSuppliment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoaderBar from "../../components/Loader";

const EditSupplement = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: supplementData,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useGetSupplimentId(id);

  const { mutateAsync: editSuppliment, isPending } = useEditSuppliment();

  const [formData, setFormData] = useState({
    name: "",
    stock: "",
    weight: "",
    price: "",
    company: "",
  });

  useEffect(() => {
    if (isSuccess && supplementData?.data) {
      const supplement = supplementData.data;
      setFormData({
        name: supplement.name || "",
        stock: supplement.stock || "",
        weight: supplement.weight || "",
        price: supplement.price || "",
        company: supplement.company || "",
      });
    }
  }, [isSuccess, supplementData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editSuppliment({ id, updatedData: formData });
      toast.success("Supplement updated successfully!");
      navigate("/stock");
    } catch (err) {
      toast.error("Failed to update supplement");
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="text-center text-yellow-400 mt-10 text-lg animate-pulse">Loading...</div>;
  }

  if (isError) {
    return <div className="text-center text-red-500 mt-10 text-lg">Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex justify-center items-center px-4 py-10">
      <ToastContainer />
      <div className="w-full max-w-2xl bg-zinc-900/90 rounded-2xl shadow-lg p-8 border border-yellow-500/20 backdrop-blur-sm">
        <h1 className="text-4xl font-bold text-yellow-400 mb-8 text-center tracking-wide uppercase">
          Edit Supplement
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {["name", "stock", "weight", "price", "company"].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-sm font-semibold mb-1 capitalize text-zinc-300">
                {field}
              </label>
              <input
                type={field === "stock" || field === "price" ? "number" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${field}`}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-150"
                required
              />
            </div>
          ))}

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="px-5 py-2 rounded-lg border border-zinc-600 text-zinc-300 hover:bg-zinc-800 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                isPending
                  ? "bg-yellow-300 cursor-not-allowed text-black"
                  : "bg-yellow-400 hover:bg-yellow-500 text-black"
              }`}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSupplement;
