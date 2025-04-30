'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type UserEntry = {
  id: string;
  value: number;
  date: string;
  notes?: string;
};

export default function TablePage() {
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
      setEntries(data);
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

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Data Table</h1>
      
      {entries.length === 0 ? (
        <p className="text-gray-500">No entries found. Create some entries on the homepage.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3">Date</th>
                <th className="p-3">Value</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <tr key={entry.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{formatDate(entry.date)}</td>
                  <td className="p-3 font-medium">{entry.value}</td>
                  <td className="p-3">{entry.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}