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

// Chart.js Komponenten registrieren
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

export default function DiagrammPage() {
  const [entries, setEntries] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEntries() {
      try {
        const response = await fetch('/api/entries');
        
        if (!response.ok) {
          throw new Error('Daten konnten nicht geladen werden.');
        }
        
        const data = await response.json();
        // Sortiere Einträge nach Datum (älteste zuerst)
        const sortedData = [...data].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setEntries(sortedData);
      } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
        setError('Daten konnten nicht geladen werden. Bitte versuche es später erneut.');
      } finally {
        setLoading(false);
      }
    }
    
    loadEntries();
  }, []);

  // Formatiert das Datum für die Anzeige im Diagramm
  const formatDateForChart = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
    }).format(date);
  };

  // Bereite Daten für das Diagramm vor
  const chartData = {
    labels: entries.map(entry => formatDateForChart(entry.date)),
    datasets: [
      {
        label: 'Werte im Zeitverlauf',
        data: entries.map(entry => entry.value),
        borderColor: 'rgb(59, 130, 246)', // Blau
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
    ],
  };

  // Optionen für das Diagramm
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Verlauf der Werte',
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
      <h1 className="text-2xl font-bold mb-6">Diagrammansicht</h1>
      
      {entries.length === 0 ? (
        <p className="text-gray-500">Noch keine Daten vorhanden. Erstelle Einträge auf der Startseite, um ein Diagramm zu sehen.</p>
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