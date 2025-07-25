import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import Navbar from '../../components/NavBar';
import { useRevenueChart } from '../../hooks/useRevenueChart'; // adjust path

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const RevenueTrends = () => {
  const [range, setRange] = useState('monthly');
  const [monthly, setMonthly] = useState({});
  const [weekly, setWeekly] = useState({});
  const [daily, setDaily] = useState([]);

  const { data, isSuccess, isLoading, isError, error } = useRevenueChart();

  useEffect(() => {
    if (isSuccess) {
      setMonthly(data.revenueByMonth || {});
      setWeekly(data.revenueByWeek || {});
      setDaily(data.dailyRevenue || []);
    }
  }, [isSuccess, data]);

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const datasets = {
    monthly: {
      labels: Object.keys(monthly),
      data: Object.values(monthly),
    },
    weekly: {
      labels: Object.keys(weekly),
      data: Object.values(weekly),
    },
    daily: {
      labels: daily.map((d) => getDayName(d._id)),
      data: daily.map((d) => d.totalRevenue),
    },
  };

  const selected = datasets[range];
  const totalRevenue = selected.data.reduce((sum, v) => sum + v, 0);

  const chartData = {
    labels: selected.labels,
    datasets: [
      {
        label: `${range.charAt(0).toUpperCase() + range.slice(1)} Revenue`,
        data: selected.data,
        borderColor: '#facc15',
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(250, 204, 21, 0.2)');
          gradient.addColorStop(1, 'rgba(15,15,15, 0.1)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#facc15',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#facc15' } },
      tooltip: {
        backgroundColor: '#18181b',
        titleColor: '#facc15',
        bodyColor: '#fff',
      },
    },
    scales: {
      x: {
        ticks: { color: '#d4d4d8' },
        grid: { color: '#27272a' },
      },
      y: {
        ticks: {
          color: '#d4d4d8',
          callback: (value) => `₹${value.toLocaleString()}`,
        },
        grid: { color: '#27272a' },
      },
    },
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-yellow-400 mb-1">Revenue Trends</h1>
          <p className="text-sm text-gray-400">Analyze revenue performance over different periods.</p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center bg-zinc-800 p-2 rounded-full mb-6 w-full max-w-md mx-auto">
          {['daily', 'weekly', 'monthly'].map((val) => (
            <button
              key={val}
              className={`px-4 py-1 rounded-full text-sm font-semibold capitalize transition ${
                range === val
                  ? 'bg-yellow-400 text-black shadow'
                  : 'text-gray-400 hover:text-yellow-300'
              }`}
              onClick={() => setRange(val)}
            >
              {val}
            </button>
          ))}
        </div>

        {/* Chart Section */}
        <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg border border-yellow-500/20">
          <h2 className="text-xl font-semibold text-yellow-400 mb-1">
            {range.charAt(0).toUpperCase() + range.slice(1)} Revenue
          </h2>
          <p className="text-4xl font-bold text-white">₹{totalRevenue.toLocaleString()}</p>
          {/* <p className="text-sm text-green-400 mb-4">This {range} +12%</p> */}

          {isLoading ? (
            <p className="text-gray-400 mt-4">Loading chart...</p>
          ) : isError ? (
            <p className="text-red-400 mt-4">Failed to load data: {error?.message}</p>
          ) : (
            <Line data={chartData} options={options} height={100} />
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueTrends;
