'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Line } from 'react-chartjs-2';
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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDailyAverages, setShowDailyAverages] = useState(true);

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/entries');
      
      if (response.status === 401) {
        // Unauthorized - redirect to login
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to load data');
      }
      
      const data = await response.json();
      
      // Sort by date (oldest to newest)
      const sortedData = [...data].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      setEntries(sortedData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      loadEntries();
    }
  }, [status, router, loadEntries]);

  // Format date for chart labels - removing time component to group by day
  const formatDateForGrouping = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit'
    }).format(date);
  };

  // Format date for display on chart
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Process entries to get daily averages
  const getDailyAverages = (entries: UserEntry[]) => {
    const dailyEntries: { [key: string]: number[] } = {};
    
    // Group entries by date (ignoring time)
    entries.forEach(entry => {
      const dateKey = formatDateForGrouping(entry.date);
      if (!dailyEntries[dateKey]) {
        dailyEntries[dateKey] = [];
      }
      dailyEntries[dateKey].push(entry.value);
    });
    
    // Calculate average for each day
    const result = Object.keys(dailyEntries).map(dateKey => {
      const values = dailyEntries[dateKey];
      const sum = values.reduce((total, val) => total + val, 0);
      const average = sum / values.length;
      
      // Use the first date from that day to preserve the date object
      const dateObj = new Date(dateKey);
      
      return {
        date: dateObj.toISOString(),
        value: parseFloat(average.toFixed(2)), // Round to 2 decimal places
        count: values.length // Include count of measurements
      };
    });
    
    // Sort by date
    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Display loading state while checking authentication
  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't render content if not authenticated
  if (!session) {
    return null;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p>{error}</p>
        <button 
          onClick={() => loadEntries()} 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Calculate daily averages from entries
  const dailyAverages = getDailyAverages(entries);

  const chartData = {
    labels: showDailyAverages 
      ? dailyAverages.map(day => formatDate(day.date))
      : entries.map(entry => formatDate(entry.date)),
    datasets: [
      {
        label: showDailyAverages ? 'Daily Average' : 'Individual Measurements',
        data: showDailyAverages 
          ? dailyAverages.map(day => day.value)
          : entries.map(entry => entry.value),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.2,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Data Chart</h1>
        
        {entries.length > 0 && (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">View mode:</span>
            <div className="flex items-center">
              <button
                onClick={() => setShowDailyAverages(true)}
                className={`px-3 py-1 text-sm rounded-l ${
                  showDailyAverages 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Daily Averages
              </button>
              <button
                onClick={() => setShowDailyAverages(false)}
                className={`px-3 py-1 text-sm rounded-r ${
                  !showDailyAverages 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Data Points
              </button>
            </div>
          </div>
        )}
      </div>
      
      {entries.length === 0 ? (
        <p className="text-gray-500">No entries found. Create some entries on the homepage.</p>
      ) : (
        <div>
          <div className="w-full" style={{ height: '400px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
          
          {showDailyAverages && dailyAverages.length > 0 && (
            <div className="mt-4 text-sm text-gray-500 text-center">
              Showing daily averages from {dailyAverages.length} days of data
            </div>
          )}
        </div>
      )}
    </div>
  );
}