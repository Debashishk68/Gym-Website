import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { Typography } from "@mui/material";
import { useRevenueChart } from "../hooks/useRevenueChart";
import { useEffect, useState } from "react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// All datasets

const RevenueChart = ({ label = "monthly" }) => {
  const [monthly, setMonthly] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [daily, setDaily] = useState([]);
  const { data, isSuccess } = useRevenueChart();

  useEffect(() => {
    if (isSuccess) {
      setMonthly(data.monthlyRevenue || []);
      setWeekly(data.weeklyRevenue || []);
      setDaily(data.dailyRevenue || []);
    }
  }, [isSuccess, data]);

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" }); // "Mon"
  };

  const datasets = {
    monthly: {
      labels: monthly.map((entry) => entry.month),
      data: monthly.map((entry) => entry.totalRevenue),
    },
    weekly: {
      labels: weekly.map((entry) => entry.week),
      data: weekly.map((entry) => entry.totalRevenue),
    },
    daily: {
      labels: daily.map((entry) => getDayName(entry.date)),
      data: daily.map((entry) => entry.totalRevenue),
    },
  };

  const chartData = {
    labels: datasets[label].labels,
    datasets: [
      {
        label: `${label.charAt(0).toUpperCase() + label.slice(1)} Revenue`,
        data: datasets[label].data,
        borderColor: "#facc15",
        backgroundColor: "#facc15",
        pointBackgroundColor: "#facc15",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  return (
    <div className="bg-zinc-900 p-5 rounded-xl shadow-md border border-yellow-500/30">
      <Typography
        variant="h6"
        fontWeight="bold"
        color="warning.main"
        gutterBottom
      >
        {label.charAt(0).toUpperCase() + label.slice(1)} Revenue
      </Typography>
      <Line data={chartData} />
    </div>
  );
};



export default RevenueChart;
