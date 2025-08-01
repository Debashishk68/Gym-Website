import React, { useEffect, useState } from "react";
import Navbar from "../../components/NavBar.jsx";
import StatCard from "../../components/StatCard.jsx";
import RevenueChart from "../../components/RevenueChart.jsx";
import SectionHeader from "../../components/SectionHeader.jsx";
import thumbnail from "../../assets/Thumbnail.svg"; // capital T ✅
import { FaUserAlt, FaRupeeSign } from "react-icons/fa";
import { useDashboard } from "../../hooks/useDashboard.js";
import LoaderBar from "../../components/Loader.jsx";
import NotLoggedIn from "../../components/NotLogin.jsx";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const [data, setData] = useState([]);
  const {
    data: clients,
    isSuccess,
    isError,
    error,
    isLoading,
  } = useDashboard();

  useEffect(() => {
    if (isSuccess) {
      setData(clients);
    }
  }, [isSuccess, clients]);
  if (isError && error.message === "Login failed") {
    return <NotLoggedIn />;
  }

  return (
    <div
      className="min-h-screen text-white"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${thumbnail})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center 50px",
      }}
    >
      <Navbar />
      {isLoading && <LoaderBar />}

      <div className="px-4 sm:px-6 md:px-10 py-10 space-y-10 max-w-screen-xl mx-auto bg-black/60 rounded-2xl backdrop-blur-md shadow-2xl">
        {/* Heading */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-zinc-900 p-6 rounded-xl shadow-lg mb-6">
          {/* Welcome Text */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-400 text-center sm:text-left transition-all duration-300 animate-fadeIn">
            Welcome, Admin 👋
          </h2>

          {/* Diet Plans Button */}
          <Link
            to="/diet-plans"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-500 hover:scale-105 transition-transform duration-200 shadow-md"
          >
            <span>Diet Plans</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <StatCard
            icon={<FaUserAlt className="text-3xl text-yellow-300" />}
            value={`${data.clients || 0}+`}
            label="Total Members"
            className="hover:scale-105 transition-transform duration-300 shadow-lg bg-white/10 backdrop-blur-md rounded-xl p-4"
          />
          <StatCard
            icon={<FaRupeeSign className="text-3xl text-green-300" />}
            value={`₹${data.revenue || 0}+`}
            label="Monthly Revenue"
            className="hover:scale-105 transition-transform duration-300 shadow-lg bg-white/10 backdrop-blur-md rounded-xl p-4"
          />
        </div>

        {/* Charts Section */}
        <div className="space-y-6">
          <SectionHeader title="📊 Revenue Trends" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 p-4 rounded-xl shadow-md hover:shadow-yellow-400/20 transition-all duration-300">
              <RevenueChart label={"monthly"} />
            </div>
            <div className="bg-white/5 p-4 rounded-xl shadow-md hover:shadow-yellow-400/20 transition-all duration-300">
              <RevenueChart label={"weekly"} />
            </div>
            <div className="bg-white/5 p-4 rounded-xl shadow-md hover:shadow-yellow-400/20 transition-all duration-300">
              <RevenueChart label={"daily"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
