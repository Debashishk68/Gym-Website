import React, { useState } from "react";
import Navbar from "../../components/NavBar";
import { FaWhatsapp } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { useGenInvoice, useGetInvoice } from "../../hooks/useInvoice";

const statusColor = {
  Active: "text-green-300 bg-green-700/60",
  Pending: "text-yellow-300 bg-yellow-700/60",
  Failed: "text-red-300 bg-red-700/60",
  Paid: "text-green-300 bg-green-700/60",
};

const Invoices = () => {
  const [generatedPDFs, setGeneratedPDFs] = useState({});
  const [generatingId, setGeneratingId] = useState(null);

  const { data, isLoading, isSuccess, isError, error } = useGetInvoice();
  const { mutate: GenInvoice, isPending } = useGenInvoice();

  const handleGeneratePdf = (invoice) => {
    setGeneratingId(invoice._id);
    GenInvoice(invoice, {
      onSuccess: (res) => {
        setGeneratedPDFs((prev) => ({
          ...prev,
          [invoice._id]: {
            generated: true,
            url: res.url,
          },
        }));
        setGeneratingId(null);
      },
      onError: (err) => {
        console.error("PDF generation failed:", err.message);
        setGeneratingId(null);
      },
    });
  };

  const handleWhatsAppClick = (invoice) => {
    const date = new Date(invoice.date).toLocaleDateString("en-IN");
    const pdfData = generatedPDFs[invoice._id];

    const message = `Hi ${invoice.name}, here is your invoice:\n\nInvoice ID: ${invoice._id}\nDate: ${date}\nAmount: ₹${invoice.amount}\nStatus: ${invoice.status}\n\nDownload PDF: ${pdfData?.url || "Link not available"}`;

    const url = `https://wa.me/91${invoice.whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN");
  };

  const invoices = isSuccess ? data : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto mt-10 p-6 rounded-2xl shadow-2xl bg-zinc-900/80 border border-yellow-400/20 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-yellow-300 mb-6 tracking-wide">
          Invoices
        </h1>

        {isLoading ? (
          <p className="text-gray-400 animate-pulse">Loading invoices...</p>
        ) : isError ? (
          <p className="text-red-500">Failed to load invoices: {error.message}</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-yellow-400/10">
              <table className="min-w-full table-auto text-sm text-left">
                <thead className="bg-zinc-800/70 text-yellow-300 uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4">Invoice ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Send</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700">
                  {invoices.map((invoice) => (
                    <tr key={invoice._id} className="hover:bg-zinc-800/50 transition">
                      <td className="px-6 py-4 font-mono text-yellow-200 truncate max-w-[120px]">
                        {invoice._id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 truncate max-w-[140px]">{invoice.name}</td>
                      <td className="px-6 py-4">{formatDate(invoice.date)}</td>
                      <td className="px-6 py-4">₹{invoice.amount}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold shadow ${statusColor[invoice.status] || "bg-gray-700 text-white"}`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {!generatedPDFs[invoice._id]?.generated ? (
                          <button
                            onClick={() => handleGeneratePdf(invoice)}
                            className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-yellow-400 transition-all duration-200 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={generatingId === invoice._id}
                          >
                            {generatingId === invoice._id ? (
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
                  ))}
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
