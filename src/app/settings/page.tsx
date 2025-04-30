"use client";

import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    weightGoal: '',
    lossRate: '',
    carbFatRatio: '',
    bufferValue: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

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
              lossRate: data.settings.lossRate?.toString() || '',
              carbFatRatio: data.settings.carbFatRatio?.toString() || '',
              bufferValue: data.settings.bufferValue?.toString() || ''
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
        <div className={`p-4 mb-6 rounded ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="weightGoal" className="block text-sm font-medium mb-1">
              Weight Goal
            </label>
            <input
              type="number"
              id="weightGoal"
              name="weightGoal"
              step="0.1"
              value={settings.weightGoal}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your target weight"
            />
            <p className="text-xs text-gray-500 mt-1">Your target weight in the same units as your entries</p>
          </div>

          <div className="mb-4">
            <label htmlFor="lossRate" className="block text-sm font-medium mb-1">
              Weight Loss Rate
            </label>
            <input
              type="number"
              id="lossRate"
              name="lossRate"
              step="0.01"
              value={settings.lossRate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter desired weight loss rate"
            />
            <p className="text-xs text-gray-500 mt-1">Desired weight loss per week</p>
          </div>

          <div className="mb-4">
            <label htmlFor="carbFatRatio" className="block text-sm font-medium mb-1">
              Carb/Fat Ratio
            </label>
            <input
              type="number"
              id="carbFatRatio"
              name="carbFatRatio"
              step="0.01"
              value={settings.carbFatRatio}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your preferred carb/fat ratio"
            />
            <p className="text-xs text-gray-500 mt-1">Your preferred ratio of carbohydrates to fats</p>
          </div>

          <div className="mb-6">
            <label htmlFor="bufferValue" className="block text-sm font-medium mb-1">
              Buffer Value
            </label>
            <input
              type="number"
              id="bufferValue"
              name="bufferValue"
              step="0.1"
              value={settings.bufferValue}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter buffer value"
            />
            <p className="text-xs text-gray-500 mt-1">Buffer value for your weight loss calculations</p>
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
    </div>
  );
}