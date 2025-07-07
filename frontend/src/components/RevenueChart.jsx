import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';
import { Typography } from '@mui/material';

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
const datasets = {
  monthly: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [12000, 15000, 18000, 14000, 17000, 22000],
  },
  weekly: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    data: [8000, 10000, 9500, 11000],
  },
  daily: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [1800, 2200, 2000, 2500, 1900, 2100, 2300],
  },
};

const RevenueChart = ({ label = "monthly" }) => {
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
      <Typography variant="h6" fontWeight="bold" color="warning.main" gutterBottom>
        {label.charAt(0).toUpperCase() + label.slice(1)} Revenue
      </Typography>
      <Line data={chartData} />
    </div>
  );
};

export default RevenueChart;
