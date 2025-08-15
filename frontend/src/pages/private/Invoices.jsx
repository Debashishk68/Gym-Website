import React, { useState } from "react";
import Navbar from "../../components/NavBar.jsx";
import { FaWhatsapp } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { useGenInvoice, useGetInvoice } from "../../hooks/useInvoice.js";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import months from "../../utils/months.js"; // Assuming months.js exports array of { value, label }

const statusColor = {
  Active: "text-green-300 bg-green-700/60",
  Pending: "text-yellow-300 bg-yellow-700/60",
  Failed: "text-red-300 bg-red-700/60",
  Paid: "text-green-300 bg-green-700/60",
};

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const today = new Date();
  const [month, setMonth] = useState(""); // Empty means "All months"
  const [year, setYear] = useState("");   // Empty means "All years"

  const years = Array.from({ length: 5 }, (_, i) =>
    String(today.getFullYear() - i)
  );

  const { data, isLoading, isSuccess, isError, error, refetch } = useGetInvoice();
  const {
    mutate: GenInvoice,
    isPending,
    isError: isGenError,
    isSuccess: isGenSuccess,
    error: genError,
  } = useGenInvoice();

  const [activeInvoiceId, setActiveInvoiceId] = useState(null);
  const navigate = useNavigate();

  const handleGeneratePdf = (invoice) => {
    setActiveInvoiceId(invoice._id);
    GenInvoice(invoice, {
      onSuccess: () => {
        refetch();
        setActiveInvoiceId(null);
      },
      onError: () => {
        setActiveInvoiceId(null);
      },
    });
  };

  const handleWhatsAppClick = (invoice) => {
    const date = new Date(invoice.createdAt).toLocaleDateString("en-IN");
    const invoiceId = invoice._id.slice(0, 8);
    const total = invoice.amount.toFixed(2);
    const invoiceLink = invoice.invoicepdf || "Invoice link not available";

    const message = `Hi ${invoice.name},

Here is your invoice for your supplement purchase:

Invoice ID: ${invoiceId}
Date: ${date}
Total: ₹${total}

Download PDF: ${invoiceLink}`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.whatsapp.com/send?phone=91${invoice.whatsappNumber}&text=${encodedMessage}`;
    window.open(url, "_blank");
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-IN");

  const invoices = isSuccess
    ? data.filter((inv) => {
        const date = new Date(inv.date);
        const invoiceMonth = String(date.getMonth() + 1).padStart(2, "0");
        const invoiceYear = String(date.getFullYear());

        // Only filter by month/year if a value is selected
        const matchesMonthYear =
          (!month || invoiceMonth === month) &&
          (!year || invoiceYear === year);

        const search = searchTerm.trim().toLowerCase();
        const matchesSearch =
          inv._id.toLowerCase().includes(search) ||
          inv.name.toLowerCase().includes(search) ||
          inv.whatsappNumber.includes(searchTerm);

        return matchesMonthYear && matchesSearch;
      })
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto mt-10 p-6 rounded-2xl shadow-2xl bg-zinc-900/80 border border-yellow-400/20 backdrop-blur-md">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-yellow-300 tracking-wide">
            Invoices
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search Invoice ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="peer w-full pl-10 pr-3 py-2 rounded-md bg-zinc-800 border border-yellow-400 text-yellow-200 text-sm placeholder:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200"
              />
              <FiSearch className="absolute left-3 top-2.5 text-yellow-400 text-lg peer-focus:text-yellow-300 transition-all duration-200" />
            </div>

            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="bg-zinc-800 text-yellow-200 border border-yellow-400 rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Months</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="bg-zinc-800 text-yellow-200 border border-yellow-400 rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <p className="text-gray-400 animate-pulse">Loading invoices...</p>
        ) : isError ? (
          <p className="text-red-500">
            Failed to load invoices: {error.message}
          </p>
        ) : (
          <>
            {isGenError && (
              <p className="text-red-500 mb-4">
                Error generating invoice: {genError.message}
              </p>
            )}
            {isGenSuccess && (
              <p className="text-green-400 mb-4">
                Invoice PDF generated successfully.
              </p>
            )}
            <div className="overflow-x-auto rounded-xl border border-yellow-400/10">
              <table className="min-w-full table-auto text-sm text-left">
                <thead className="bg-zinc-800/70 text-yellow-300 uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4">Invoice ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700">
                  {invoices.map((invoice) => {
                    const isGenerating =
                      activeInvoiceId === invoice._id && isPending;

                    return (
                      <tr
                        key={invoice._id}
                        className="hover:bg-zinc-800/50 transition"
                      >
                        <td className="px-6 py-4 font-mono text-yellow-200 truncate max-w-[120px]">
                          {invoice._id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 truncate max-w-[140px]">
                          {invoice.name}
                        </td>
                        <td className="px-6 py-4">{formatDate(invoice.date)}</td>
                        <td className="px-6 py-4">₹{invoice.amount}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold shadow ${
                              statusColor[invoice.status] || "bg-gray-700 text-white"
                            }`}
                          >
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {!invoice.invoicepdf ? (
                            <button
                              onClick={() => handleGeneratePdf(invoice)}
                              className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-yellow-400 transition-all duration-200 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                              disabled={isGenerating}
                            >
                              {isGenerating ? (
                                <>
                                  <IoMdRefresh className="animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                "Generate PDF"
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleWhatsAppClick(invoice)}
                              className="hover:scale-110 transition-transform"
                              title="Send on WhatsApp"
                            >
                              <FaWhatsapp className="text-green-400 text-2xl drop-shadow" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-right">
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
