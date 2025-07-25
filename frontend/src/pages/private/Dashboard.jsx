import React, { useEffect, useState } from "react";
import Navbar from "../../components/NavBar";
import StatCard from "../../components/StatCard";
import SearchBar from "../../components/SearchBar";
import RevenueChart from "../../components/RevenueChart";
import SectionHeader from "../../components/SectionHeader";
import thumbnail from "../../assets/thumbnail.svg";
import { FaUserAlt, FaRupeeSign, FaChartBar } from "react-icons/fa";
import { useDashboard } from "../../hooks/useDashboard";
import LoaderBar from "../../components/Loader"; 

const DashboardPage = () => {
  const [data, setData] = useState([]);
  const { data: clients, isSuccess, isError, error, isLoading } = useDashboard(); // 👈 add isLoading

  useEffect(() => {
    if (isSuccess) {
      setData(clients);
    }
  }, [isSuccess, clients]);

  return (
    <div
      className="min-h-screen text-white"
      style={{
        backgroundImage: `url(${thumbnail})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center 50px",
      }}
    >
      <Navbar />
      {isLoading && <LoaderBar />} {/* ✅ Loader shows while fetching */}

      <div className="px-4 sm:px-6 md:px-10 py-10 space-y-10 max-w-screen-xl mx-auto bg-black/70 rounded-xl backdrop-blur-md shadow-xl">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 text-center sm:text-left">
          Welcome, Admin
        </h2>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard icon={<FaUserAlt />} value={`${data.clients || 0}+`} label="Total Members" />
          <StatCard icon={<FaRupeeSign />} value={`₹${data.revenue || 0}+`} label="Monthly Revenue" />
          <StatCard icon={<FaChartBar />} value="10+" label="New this week" />
        </div>

        {/* Charts */}
        <div className="space-y-6 flex flex-col">
          <SectionHeader title="Revenue Trends" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <RevenueChart label={"monthly"} />
            <RevenueChart label={"weekly"} />
            <RevenueChart label={"daily"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
