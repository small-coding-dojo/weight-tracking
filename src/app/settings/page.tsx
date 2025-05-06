"use client";

import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useTheme } from '@/components/theme-provider';

export default function SettingsPage() {
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [settings, setSettings] = useState({
    weightGoal: '',
    lossRate: '0.0055',
    carbFatRatio: '0.6',
    bufferValue: '0.0075'
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  // Check for dark mode safely (client-side only)
  useEffect(() => {
    // Only run in the browser
    if (typeof window !== 'undefined') {
      setIsDarkMode(
        theme === 'dark' || 
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
  }, [theme]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const session = await getSession();
        if (!session) return;

        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.settings) {
            setSettings({
              weightGoal: data.settings.weightGoal?.toString() || '',
              lossRate: data.settings.lossRate?.toString() || '0.0055',
              carbFatRatio: data.settings.carbFatRatio?.toString() || '0.6',
              bufferValue: data.settings.bufferValue?.toString() || '0.0075'
            });
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weightGoal: settings.weightGoal ? parseFloat(settings.weightGoal) : null,
          lossRate: settings.lossRate ? parseFloat(settings.lossRate) : null,
          carbFatRatio: settings.carbFatRatio ? parseFloat(settings.carbFatRatio) : null,
          bufferValue: settings.bufferValue ? parseFloat(settings.bufferValue) : null,
        }),
      });

      if (response.ok) {
        setMessage('Settings saved successfully!');
        setMessageType('success');
      } else {
        const error = await response.json();
        setMessage(error.message || 'Failed to save settings');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('An error occurred while saving settings');
      setMessageType('error');
    } finally {
      setLoading(false);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">User Settings</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded ${
          messageType === 'success' 
            ? isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
            : isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}
      
      <div className={`rounded-lg shadow p-6 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="weightGoal" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : ''}`}>
              Weight Goal
            </label>
            <input
              type="number"
              id="weightGoal"
              name="weightGoal"
              step="0.1"
              value={settings.weightGoal}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300'
              }`}
              placeholder="Enter your target weight"
            />
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your target weight in the same units as your entries</p>
          </div>

          <div className="mb-4">
            <label htmlFor="lossRate" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : ''}`}>
              Weight Loss Rate
            </label>
            <input
              type="number"
              id="lossRate"
              name="lossRate"
              step="0.01"
              value={settings.lossRate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300'
              }`}
              placeholder="Enter desired weight loss rate"
            />
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Desired weight loss per week</p>
          </div>

          <div className="mb-4">
            <label htmlFor="carbFatRatio" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : ''}`}>
              Carb/Fat Ratio
            </label>
            <input
              type="number"
              id="carbFatRatio"
              name="carbFatRatio"
              step="0.01"
              value={settings.carbFatRatio}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300'
              }`}
              placeholder="Enter your preferred carb/fat ratio"
            />
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your preferred ratio of carbohydrates to fats</p>
          </div>

          <div className="mb-6">
            <label htmlFor="bufferValue" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : ''}`}>
              Buffer Value
            </label>
            <input
              type="number"
              id="bufferValue"
              name="bufferValue"
              step="0.1"
              value={settings.bufferValue}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300'
              }`}
              placeholder="Enter buffer value"
            />
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Buffer value for your weight loss calculations</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>

      {/* Data Management Section */}
      <div className={`rounded-lg shadow p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-200' : ''}`}>Data Management</h2>
        
        <div className="space-y-4">
          <div className="border-b pb-4 dark:border-gray-700">
            <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-200' : ''}`}>Import Data</h3>
            <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Import historic data from Excel spreadsheets with structured measurement data.
            </p>
            <a 
              href="/import" 
              className={`inline-flex items-center ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Import from Excel
            </a>
          </div>

          {/* Room for future data management options */}
        </div>
      </div>
    </div>
  );
}