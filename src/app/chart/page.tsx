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

  // Format date for chart labels
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
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

  const chartData = {
    labels: entries.map(entry => formatDate(entry.date)),
    datasets: [
      {
        label: 'Values Over Time',
        data: entries.map(entry => entry.value),
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
      <h1 className="text-2xl font-bold mb-6">Data Chart</h1>
      
      {entries.length === 0 ? (
        <p className="text-gray-500">No entries found. Create some entries on the homepage.</p>
      ) : (
        <div className="w-full" style={{ height: '400px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}