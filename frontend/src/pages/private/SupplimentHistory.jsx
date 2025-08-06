import React, { useState, useMemo } from "react";
import {
  FaSearch,
  FaRupeeSign,
  FaCalendarAlt,
  FaExclamationCircle,
} from "react-icons/fa";
import SupplementsNavbar from "../../components/SupplimentNavbar.jsx";
import { InputField } from "../../components/InputField.jsx";
import { useGetSellingSupplimentsData } from "../../hooks/useSuppliment.js";

const SupplementHistory = () => {
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const { data = [] } = useGetSellingSupplimentsData();

  const formatDate = (dateStr) => {
    return new Date(dateStr).toISOString().split("T")[0];
  };

  // Filter sales by supplement name and date
  const filteredSales = useMemo(() => {
    return data.filter((item) => {
      const nameMatch = item.supplementName
        ?.join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      const dateMatch = filterDate
        ? formatDate(item.createdAt) === filterDate
        : true;
      return nameMatch && dateMatch;
    });
  }, [data, search, filterDate]);

  // Total revenue calculation
  const totalRevenue = useMemo(() => {
    return filteredSales.reduce((acc, sale) => acc + (sale.total || 0), 0);
  }, [filteredSales]);

  // Daily sales summary (quantity and amount)
  const dailySales = useMemo(() => {
    const result = {};
    filteredSales.forEach((sale) => {
      const date = formatDate(sale.createdAt);
      if (!result[date]) result[date] = { amount: 0, quantity: 0 };
      result[date].amount += sale.total || 0;
      result[date].quantity += sale.quantity || 0;
    });
    return result;
  }, [filteredSales]);

  // Members with due amounts
  const dueMembers = useMemo(() => {
    return data.filter((sale) => sale.amountDue && sale.amountDue > 0);
  }, [data]);

  // Group sales by date and customer
  const groupedByDateAndCustomer = useMemo(() => {
    const result = {};
    filteredSales.forEach((sale) => {
      const date = formatDate(sale.createdAt);
      const customerKey = `${sale.customerName}-${sale.mobileNumber}`;
      if (!result[date]) result[date] = {};
      if (!result[date][customerKey]) {
        result[date][customerKey] = {
          customerName: sale.customerName,
          mobileNumber: sale.mobileNumber,
          supplementNames: [],
          quantity: 0,
          total: 0,
        };
      }
      result[date][customerKey].supplementNames.push(...sale.supplementName);
      result[date][customerKey].quantity += sale.quantity;
      result[date][customerKey].total += sale.total || 0;
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
            Total Revenue: ₹{totalRevenue.toFixed(2)}
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
                  <span className="text-white font-medium">{stats.quantity}</span>
                </p>
                <p className="text-sm text-gray-300">
                  Amount:{" "}
                  <span className="text-white font-medium">₹{stats.amount.toFixed(2)}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Table - Grouped by Date and Customer */}
        <div className="overflow-x-auto rounded-xl shadow-lg mb-10">
          <table className="min-w-full text-sm bg-white/5 backdrop-blur-md border border-white/10">
            <thead>
              <tr className="text-left text-yellow-400 bg-zinc-800 uppercase text-xs tracking-widest">
                <th className="p-4">Date</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Supplement(s)</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedByDateAndCustomer).map(([date, customers]) =>
                Object.entries(customers).map(([key, info], index) => (
                  <tr
                    key={date + key + index}
                    className="border-t border-gray-700 hover:bg-zinc-700/40 transition"
                  >
                    <td className="p-4">{date}</td>
                    <td className="p-4">{info.customerName}</td>
                    <td className="p-4">{info.mobileNumber}</td>
                    <td className="p-4">
                      {[...new Set(info.supplementNames)].join(", ")}
                    </td>
                    <td className="p-4">{info.quantity}</td>
                    <td className="p-4">₹{info.total.toFixed(2)}</td>
                  </tr>
                ))
              )}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-400 font-medium">
                    No sales found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Due Members Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 border-b border-red-500 pb-2 text-red-400 flex items-center gap-2">
            <FaExclamationCircle />
            Members with Due Amount
          </h2>
          {dueMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dueMembers.map((member) => (
                <div
                  key={member._id}
                  className="bg-red-800/20 border border-red-500 p-5 rounded-xl"
                >
                  <h3 className="text-lg font-bold text-white mb-2">{member.customerName}</h3>
                  <p className="text-sm text-gray-300">Mobile: {member.mobileNumber}</p>
                  <p className="text-sm text-gray-300">
                    Due:{" "}
                    <span className="text-red-300 font-medium">
                      ₹{member.amountDue.toFixed(2)}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 font-medium">No dues found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplementHistory;
