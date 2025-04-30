'use client';

import { useState, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ImportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    imported?: number;
    errors?: string[];
    error?: string;
  } | null>(null);

  // Redirect to login page if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (status === 'loading') {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Upload error:', error);
      setResult({ error: 'An error occurred during upload' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Import Historic Data</h1>

      <div className="bg-white p-6 rounded-md shadow-md">
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Instructions</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Prepare an Excel file with columns for date and measurements</li>
            <li>Required column names: &quot;date, measurement 1, measurement 2, measurement 3&quot;</li>
            <li>Measurement 1 will be assigned 8:00 AM on the specified date</li>
            <li>Measurement 2 will be assigned 12:00 PM on the specified date</li>
            <li>Measurement 3 will be assigned 8:00 PM on the specified date</li>
            <li>Empty measurement cells will be skipped</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              Select Excel File
            </label>
            <input
              type="file"
              id="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !file}
            className={`w-full py-2 px-4 rounded-md text-white font-medium 
              ${isLoading || !file ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} 
              transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {isLoading ? 'Importing...' : 'Import Data'}
          </button>
        </form>

        {result && (
          <div className={`mt-6 p-4 rounded-md ${
            result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            {result.success ? (
              <>
                <h3 className="font-medium text-green-800">Import Successful!</h3>
                <p className="mt-1">Successfully imported {result.imported} measurements.</p>
                {result.errors && result.errors.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-medium text-amber-700">Warnings:</h4>
                    <ul className="list-disc pl-6 mt-1 text-sm text-amber-800">
                      {result.errors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-4">
                  <Link 
                    href="/table" 
                    className="text-blue-600 hover:underline"
                  >
                    View data in table
                  </Link>
                  {' | '}
                  <Link 
                    href="/chart" 
                    className="text-blue-600 hover:underline"
                  >
                    View data in chart
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-medium text-red-800">Import Failed</h3>
                <p className="mt-1 text-red-700">{result.error}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}