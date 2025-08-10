import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import {
  useGenerateSellSuppplimentpdf,
  useGetSellingSupplimentsData,
} from "../../hooks/useSuppliment.js";
import SupplementsNavbar from "../../components/SupplimentNavbar.jsx";
import months from "../../utils/months.js"; // 📌 added months list

const SupplementInvoice = () => {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetSellingSupplimentsData();
  const { mutate: GenerateSupplimentPdf } = useGenerateSellSuppplimentpdf();

  const [loadingPdfIds, setLoadingPdfIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 🗓️ Filter states
  const today = new Date();
  const [month, setMonth] = useState(
    String(today.getMonth() + 1).padStart(2, "0")
  );
  const [year, setYear] = useState(String(today.getFullYear()));
  const years = Array.from({ length: 5 }, (_, i) =>
    String(today.getFullYear() - i)
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleGeneratePdf = (saleId) => {
    setLoadingPdfIds((prev) => [...prev, saleId]);

    GenerateSupplimentPdf(saleId, {
      onSuccess: async () => {
        setLoadingPdfIds((prev) => prev.filter((id) => id !== saleId));
        refetch();
      },
      onError: (error) => {
        console.error("Failed to generate PDF:", error);
        setLoadingPdfIds((prev) => prev.filter((id) => id !== saleId));
      },
    });
  };
const handleWhatsAppClick = (sale) => {
  // Format the sale date
  const date = new Date(sale.createdAt).toLocaleDateString("en-IN");

  // Shorten invoice ID
  const invoiceId = sale._id.slice(0, 8);

  // Format total amount
  const total = sale.total.toFixed(2);

  // Fallback for invoice PDF
  const invoiceLink = sale.invoicePdf || "Invoice link not available";

  // WhatsApp message text
  const message = `Hi ${sale.customerName},

Here is your invoice for your supplement purchase:

Invoice ID: ${invoiceId}
Date: ${date}
Total: ₹${total}

Download PDF: ${invoiceLink}`;

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);

  // WhatsApp API link
  const url = `https://api.whatsapp.com/send?phone=91${sale.mobileNumber}&text=${encodedMessage}`;

  // Open WhatsApp chat in new tab
  window.open(url, "_blank");
};


  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-IN");

const filteredSales = data?.filter((sale) => {
  const saleDate = new Date(sale.createdAt);
  const saleMonth = String(saleDate.getMonth() + 1).padStart(2, "0");
  const saleYear = String(saleDate.getFullYear());

  const matchesMonthYear = saleMonth === month && saleYear === year;
  const search = searchTerm.trim().toLowerCase();

  const matchesSearch =
    sale._id.toLowerCase().includes(search) ||
    sale.customerName.toLowerCase().includes(search) ||
    sale.mobileNumber.includes(searchTerm);

  return matchesMonthYear && matchesSearch;
});


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <SupplementsNavbar />
      <div className="max-w-6xl mx-auto mt-10 p-6 rounded-2xl shadow-2xl bg-zinc-900/80 border border-yellow-400/20 backdrop-blur-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-yellow-300 tracking-wide">
            Supplement Invoices
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search Invoice ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="peer w-full pl-10 pr-3 py-2 rounded-md bg-zinc-800 border border-yellow-400 text-yellow-200 text-sm placeholder:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200"
              />
              <FiSearch className="absolute left-3 top-2.5 text-yellow-400 text-lg peer-focus:text-yellow-300 transition-all duration-200" />
            </div>

            {/* Month Filter */}
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="bg-zinc-800 text-yellow-200 border border-yellow-400 rounded-md px-3 py-2 text-sm"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            {/* Year Filter */}
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="bg-zinc-800 text-yellow-200 border border-yellow-400 rounded-md px-3 py-2 text-sm"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            {/* Refresh Button */}
            <button
              onClick={refetch}
              className="text-sm text-green-400 border border-green-400 px-3 py-1 rounded hover:bg-green-400 hover:text-black transition-all"
            >
              {isFetching ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-gray-400 animate-pulse">Loading sales...</p>
        ) : isError ? (
          <p className="text-red-500">Failed to load sales: {error.message}</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-yellow-400/10">
              <table className="min-w-full table-auto text-sm text-left">
                <thead className="bg-zinc-800/70 text-yellow-300 uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4">Invoice ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Supplement</th>
                    <th className="px-6 py-4">Qty</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700">
                  {filteredSales?.map((sale) => (
                    <tr
                      key={sale._id}
                      className="hover:bg-zinc-800/50 transition"
                    >
                      <td className="px-6 py-4 font-mono text-yellow-200 truncate max-w-[120px]">
                        {sale._id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">{sale.customerName}</td>
                      <td className="px-6 py-4">
                        {formatDate(sale.createdAt)}
                      </td>
                      <td className="px-6 py-4">{sale.supplementName}</td>
                      <td className="px-6 py-4">{sale.quantity}</td>
                      <td className="px-6 py-4">₹{sale.total.toFixed(2)}</td>
                      <td className="px-6 py-4 flex gap-2 items-center">
                        {!sale.invoicePdf ? (
                          <button
                            onClick={() => handleGeneratePdf(sale._id)}
                            className="text-xs px-2 py-1 border border-yellow-400 rounded text-yellow-300 hover:bg-yellow-400 hover:text-black transition"
                            disabled={loadingPdfIds.includes(sale._id)}
                          >
                            {loadingPdfIds.includes(sale._id)
                              ? "Generating..."
                              : "Generate"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleWhatsAppClick(sale)}
                            className="hover:scale-110 transition-transform"
                            title="Send on WhatsApp"
                          >
                            <FaWhatsapp className="text-green-400 text-2xl drop-shadow" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-right">
              <p className="text-sm text-gray-400">
                Total Sales:{" "}
                <span className="text-white font-semibold">
                  {filteredSales?.length}
                </span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SupplementInvoice;
