'use client';

import { useEffect, useState } from 'react';
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

type UserEntry = {
  id: string;
  value: number;
  date: string;
  notes?: string;
};

export default function ChartPage() {
  const [entries, setEntries] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEntries() {
      try {
        const response = await fetch('/api/entries');
        
        if (!response.ok) {
          throw new Error('Data could not be loaded.');
        }
        
        const data = await response.json();
        // Sort entries by date (oldest first)
        const sortedData = [...data].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setEntries(sortedData);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Data could not be loaded. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    loadEntries();
  }, []);

  // Format date for chart display
  const formatDateForChart = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
    }).format(date);
  };

  // Prepare data for the chart
  const chartData = {
    labels: entries.map(entry => formatDateForChart(entry.date)),
    datasets: [
      {
        label: 'Values over time',
        data: entries.map(entry => entry.value),
        borderColor: 'rgb(59, 130, 246)', // Blue
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Value History',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Chart View</h1>
      
      {entries.length === 0 ? (
        <p className="text-gray-500">No data available yet. Create entries on the homepage to see a chart.</p>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="h-[60vh]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}