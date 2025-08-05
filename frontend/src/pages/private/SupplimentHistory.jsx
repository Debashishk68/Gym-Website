import React, { useState, useMemo } from "react";
import { FaSearch, FaRupeeSign, FaCalendarAlt } from "react-icons/fa";
import SupplementsNavbar from "../../components/SupplimentNavbar.jsx";
import { InputField } from "../../components/InputField.jsx";

// Dummy Data
const dummySales = [
  { date: "2025-08-01", name: "Whey Protein", quantity: 2, amount: 2400 },
  { date: "2025-08-01", name: "BCAA", quantity: 1, amount: 1200 },
  { date: "2025-08-02", name: "Creatine", quantity: 3, amount: 1800 },
  { date: "2025-08-03", name: "Whey Protein", quantity: 1, amount: 1200 },
  { date: "2025-08-03", name: "Mass Gainer", quantity: 2, amount: 3000 },
];

const SupplementHistory = () => {
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const filteredSales = useMemo(() => {
    return dummySales.filter((item) => {
      const matchesName = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesDate = filterDate ? item.date === filterDate : true;
      return matchesName && matchesDate;
    });
  }, [search, filterDate]);

  const totalRevenue = useMemo(
    () => filteredSales.reduce((acc, sale) => acc + sale.amount, 0),
    [filteredSales]
  );

  const dailySales = useMemo(() => {
    const result = {};
    filteredSales.forEach((sale) => {
      if (!result[sale.date]) result[sale.date] = { amount: 0, quantity: 0 };
      result[sale.date].amount += sale.amount;
      result[sale.date].quantity += sale.quantity;
    });
    return result;
  }, [filteredSales]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-zinc-900 to-black text-white p-6">
      <SupplementsNavbar />

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🧾 Supplement Sell History
        </h1>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <InputField
            label="Search Supplement"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g., Whey Protein"
            icon={<FaSearch />}
          />
          <InputField
            label="Filter by Date"
            name="filterDate"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            icon={<FaCalendarAlt />}
          />
        </div>

        {/* Total Revenue */}
        <div className="mb-10 bg-white/5 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/10">
          <h2 className="text-2xl font-semibold flex items-center gap-3 text-yellow-400">
            <FaRupeeSign />
            Total Revenue: ₹{totalRevenue}
          </h2>
        </div>

        {/* Daily Sales Summary */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">
            📅 Daily Sales Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(dailySales).map(([date, stats]) => (
              <div
                key={date}
                className="bg-white/5 backdrop-blur-md p-5 rounded-xl border border-gray-600 hover:border-yellow-400 transition-all"
              >
                <h3 className="text-lg font-bold mb-2">{date}</h3>
                <p className="text-sm text-gray-300">
                  Quantity Sold:{" "}
                  <span className="text-white font-medium">
                    {stats.quantity}
                  </span>
                </p>
                <p className="text-sm text-gray-300">
                  Amount:{" "}
                  <span className="text-white font-medium">
                    ₹{stats.amount}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Table */}
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full text-sm bg-white/5 backdrop-blur-md border border-white/10">
            <thead>
              <tr className="text-left text-yellow-400 bg-zinc-800 uppercase text-xs tracking-widest">
                <th className="p-4">Date</th>
                <th className="p-4">Supplement</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-700 hover:bg-zinc-700/40 transition"
                >
                  <td className="p-4">{sale.date}</td>
                  <td className="p-4">{sale.name}</td>
                  <td className="p-4">{sale.quantity}</td>
                  <td className="p-4">₹{sale.amount}</td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center p-6 text-gray-400 font-medium"
                  >
                    No sales found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupplementHistory;
