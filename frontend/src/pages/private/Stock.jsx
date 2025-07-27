import React, { useEffect, useState } from "react";
import Navbar from "../../components/NavBar";
import {
  FaBoxes,
  FaWeight,
  FaRupeeSign,
  FaIndustry,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import {
  useDeleteSupppliment,
  useGetAllSuppliments,
} from "../../hooks/useSuppliment";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Cart = () => {
  const {
    data: supplements,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useGetAllSuppliments();

  const [localSupplements, setLocalSupplements] = useState([]);
  const { mutate: deleteSuppliment, isPending: deleting } =
    useDeleteSupppliment();

  const navigate = useNavigate();

  // ⬇️ Set fetched data into local state
  useEffect(() => {
    if (isSuccess && supplements?.data) {
      setLocalSupplements(supplements.data);
    }
  }, [isSuccess, supplements]);

  const handleEdit = (item) => {
    navigate(`/edit/${item._id}`);
  };

  const handleDelete = (item) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${item.name}"?`
    );

    if (!confirmDelete) return;

    deleteSuppliment(item._id, {
      onSuccess: () => {
        toast.success(`Deleted "${item.name}" successfully.`);
        // Update local state immediately after delete
        setLocalSupplements((prev) =>
          prev.filter((supplement) => supplement._id !== item._id)
        );
      },
      onError: (error) => {
        toast.error(error?.message || "Failed to delete supplement.");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <Navbar />
      <ToastContainer position="top-right" />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-yellow-400 mb-10 text-center tracking-widest">
          🛒 Supplement Stock Overview
        </h1>

        <div className="text-right mb-6">
          <Link
            to="/add-supplement"
            className="inline-block bg-yellow-400 text-black font-semibold px-6 py-2 rounded hover:bg-yellow-500 transition-all duration-200"
          >
            Add Supplement
          </Link>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center text-yellow-400 text-lg animate-pulse">
            Loading supplements...
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center text-red-400 text-lg">
            Error: {error.message || "Failed to load supplements"}
          </div>
        )}

        {/* Supplement Grid */}
        {isSuccess && localSupplements?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {localSupplements.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-zinc-900/80 border border-yellow-500/30 shadow-md hover:shadow-yellow-500/30 backdrop-blur-sm p-6 transition-all duration-200"
              >
                <h2 className="text-xl font-bold text-yellow-300 mb-3 tracking-wide">
                  {item.name}
                </h2>

                <div className="text-zinc-300 space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <FaBoxes className="text-blue-400" />
                    <span className="text-white font-medium">Quantity:</span>
                    {item.stock}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaWeight className="text-pink-400" />
                    <span className="text-white font-medium">Weight:</span>
                    {item.weight}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaRupeeSign className="text-green-400" />
                    <span className="text-white font-medium">Price:</span> ₹
                    {item.price}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaIndustry className="text-purple-400" />
                    <span className="text-white font-medium">Company:</span>
                    {item.company}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-500 transition"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : isSuccess ? (
          <div className="text-center text-zinc-400 mt-10">
            No supplements found in the stock.
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Cart;
