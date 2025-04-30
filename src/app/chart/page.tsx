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
  const [settings, setSettings] = useState({
    weightGoal: 0,
    lossRate: 0.0055,
    bufferValue: 0.0075,
    carbFatRatio: 0.6,
  });

  // Load user settings
  const loadSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSettings({
            weightGoal: data.settings.weightGoal || 0,
            lossRate: data.settings.lossRate || 0.0055,
            bufferValue: data.settings.bufferValue || 0.0075,
            carbFatRatio: data.settings.carbFatRatio || 0.6,
          });
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

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
      loadSettings();
    }
  }, [status, router, loadEntries, loadSettings]);

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

  // Calculate linear regression for trend line
  const calculateTrendLine = (data: { date: string; value: number }[]) => {
    if (data.length < 2) return [];

    // Convert dates to numeric values (days since first entry)
    const firstDate = new Date(data[0].date).getTime();
    const xValues = data.map(point => (new Date(point.date).getTime() - firstDate) / (1000 * 60 * 60 * 24));
    const yValues = data.map(point => point.value);
    
    // Calculate means
    const xMean = xValues.reduce((sum, x) => sum + x, 0) / xValues.length;
    const yMean = yValues.reduce((sum, y) => sum + y, 0) / yValues.length;
    
    // Calculate linear regression coefficients
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < xValues.length; i++) {
      numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
      denominator += (xValues[i] - xMean) * (xValues[i] - xMean);
    }
    
    const slope = denominator !== 0 ? numerator / denominator : 0;
    const intercept = yMean - slope * xMean;
    
    // Generate trend line points
    return data.map(point => {
      const x = (new Date(point.date).getTime() - firstDate) / (1000 * 60 * 60 * 24);
      return {
        x,
        y: slope * x + intercept
      };
    });
  };

  // Calculate floor line based on starting value and settings
  const calculateFloorLine = (dailyAverages: Array<{date: string, value: number}>, settings: {weightGoal: number, lossRate: number, bufferValue: number}) => {
    if (dailyAverages.length < 7) return [];

    // Calculate starting value (average of first 6 days)
    const first6DaysData = dailyAverages.slice(0, 6);
    const sumFirst6Days = first6DaysData.reduce((sum, day) => sum + day.value, 0);
    const startValue = sumFirst6Days / 6;
    
    // Initialize result with empty values for the first 6 days
    const result: Array<number | null> = Array(6).fill(null);
    
    // Calculate floor value for day 7
    const day7FloorValue = startValue - (startValue * settings.bufferValue * 0.5);
    result.push(day7FloorValue);
    
    // Calculate remaining floor values
    let previousFloor = day7FloorValue;
    
    for (let i = 7; i < dailyAverages.length; i++) {
      const newFloor = previousFloor - ((previousFloor - settings.weightGoal) * settings.lossRate);
      result.push(newFloor);
      previousFloor = newFloor;
    }
    
    return result;
  };

  // Calculate ceiling line based on starting value and settings
  const calculateCeilingLine = (dailyAverages: Array<{date: string, value: number}>, settings: {weightGoal: number, lossRate: number, bufferValue: number, carbFatRatio: number}) => {
    if (dailyAverages.length < 7) return [];

    // Calculate starting value (average of first 6 days)
    const first6DaysData = dailyAverages.slice(0, 6);
    const sumFirst6Days = first6DaysData.reduce((sum, day) => sum + day.value, 0);
    const startValue = sumFirst6Days / 6;
    
    // Initialize result with empty values for the first 6 days
    const result: Array<number | null> = Array(6).fill(null);
    
    // Calculate ceiling value for day 7
    const day7CeilingValue = startValue + (startValue * settings.bufferValue * 0.5);
    result.push(day7CeilingValue);
    
    // Calculate remaining ceiling values
    let previousCeiling = day7CeilingValue;
    
    for (let i = 7; i < dailyAverages.length; i++) {
      const adjustedGoal = settings.weightGoal + (settings.weightGoal * settings.bufferValue);
      const newCeiling = previousCeiling - ((previousCeiling - adjustedGoal) * settings.lossRate * settings.carbFatRatio);
      result.push(newCeiling);
      previousCeiling = newCeiling;
    }
    
    return result;
  };

  // Calculate ideal line as average of floor and ceiling
  const calculateIdealLine = (floorData: Array<number | null>, ceilingData: Array<number | null>) => {
    if (floorData.length !== ceilingData.length) return [];
    
    return floorData.map((floor, index) => {
      const ceiling = ceilingData[index];
      if (floor === null || ceiling === null) return null;
      return (floor + ceiling) / 2;
    });
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
  
  // Calculate trend line data
  const trendLineData = calculateTrendLine(
    showDailyAverages 
      ? dailyAverages.map(day => ({ date: day.date, value: day.value })) 
      : entries.map(entry => ({ date: entry.date, value: entry.value }))
  );

  // Calculate floor line
  const floorLineData = calculateFloorLine(dailyAverages, settings);
  
  // Calculate ceiling line
  const ceilingLineData = calculateCeilingLine(dailyAverages, {
    ...settings,
    carbFatRatio: settings.carbFatRatio || 0.6, // Default value if not set
  });
  
  // Calculate ideal line as average of floor and ceiling
  const idealLineData = calculateIdealLine(floorLineData, ceilingLineData);

  // Set up Chart.js data
  const labels = showDailyAverages 
    ? dailyAverages.map(day => formatDate(day.date))
    : entries.map(entry => formatDate(entry.date));
  
  const dataPoints = showDailyAverages 
    ? dailyAverages.map(day => day.value)
    : entries.map(entry => entry.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: showDailyAverages ? 'Daily Average' : 'Individual Measurements',
        data: dataPoints,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.2,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
      },
      {
        label: 'Trend Line',
        data: trendLineData.map(point => point.y),
        borderColor: 'rgba(255, 99, 132, 0.8)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
        tension: 0,
      },
      {
        label: 'Floor Line',
        data: floorLineData,
        borderColor: 'lime',
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        tension: 0,
      },
      {
        label: 'Ceiling Line',
        data: ceilingLineData,
        borderColor: 'red',
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        tension: 0,
      },
      {
        label: 'Ideal Line',
        data: idealLineData,
        borderColor: 'rgba(128, 128, 128, 0.8)', // Grey color
        borderWidth: 2,
        borderDash: [3, 3], // Dotted line
        pointRadius: 0,
        fill: false,
        tension: 0,
      }
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