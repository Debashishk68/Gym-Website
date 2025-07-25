import React from "react";
import Navbar from "../../components/NavBar";
import { FaWhatsapp } from "react-icons/fa";
import { useGetInvoice } from "../../hooks/useInvoice";

const statusColor = {
  Active: "text-green-300 bg-green-700/60",
  Pending: "text-yellow-300 bg-yellow-700/60",
  Failed: "text-red-300 bg-red-700/60",
  Paid: "text-green-300 bg-green-700/60", // optional if backend uses this
};

const Invoices = () => {
  const { data, isLoading, isSuccess, isError, error } = useGetInvoice();

  const handleWhatsAppClick = (invoice) => {
    const date = new Date(invoice.date).toLocaleDateString("en-IN");
    const message = `Hi ${invoice.name}, here is your invoice:\nInvoice ID: ${invoice._id}\nDate: ${date}\nAmount: ₹${invoice.amount}\nStatus: ${invoice.status}`;
    const url = `https://wa.me/91${invoice.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN");
  };

  const invoices = isSuccess ? data : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto mt-10 p-6 rounded-xl shadow-lg bg-zinc-900/90 border border-yellow-400/30 backdrop-blur">
        <h1 className="text-3xl font-bold text-yellow-300 mb-6 tracking-wide">Invoices</h1>

        {isLoading ? (
          <p className="text-gray-400">Loading invoices...</p>
        ) : isError ? (
          <p className="text-red-500">Failed to load invoices: {error.message}</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-yellow-400/20">
              <table className="min-w-full bg-black/50 backdrop-blur-sm text-white">
                <thead className="bg-zinc-800/70 text-yellow-300 text-left">
                  <tr>
                    <th className="px-6 py-4">Invoice ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount (₹)</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Send</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice._id} className="border-t border-zinc-700 hover:bg-zinc-800/50 transition">
                      <td className="px-6 py-4 font-medium">{invoice._id.slice(0, 8).toUpperCase()}</td>
                      <td className="px-6 py-4">{invoice.name}</td>
                      <td className="px-6 py-4">{formatDate(invoice.date)}</td>
                      <td className="px-6 py-4">₹{invoice.amount}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor[invoice.status] || "bg-gray-700 text-white"}`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleWhatsAppClick(invoice)}
                          className="hover:scale-110 transition-transform"
                        >
                          <FaWhatsapp className="text-gray-400 text-xl" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-400">
                Total Invoices:{" "}
                <span className="text-white font-semibold">{invoices.length}</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Invoices;
