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
  const { data, isSuccess, isLoading, isError, error } = useRevenueChart();

  useEffect(() => {
    if (isSuccess) {
      setMonthly(data.revenueByMonth);
      setWeekly(data.revenueByWeek);
      setDaily(data.dailyRevenue);
      console.log(data);
    }
  }, [isSuccess]);
  const monthLabels = Object.keys(monthly);
  const monthData = Object.values(monthly);

  const weeklyLabels = Object.keys(weekly);
  const weeklyData = Object.values(weekly);

  const getDayName = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "short" }); // e.g., "Mon"
};

  const datasets = {
    monthly: {
      labels: monthLabels,
      data: monthData,
    },
    weekly: {
      labels: weeklyLabels,
      data: weeklyData,
    },
    daily: {
      labels: daily.map((entry) => getDayName(entry._id)),
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
