'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [value, setValue] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!value || isNaN(parseFloat(value))) {
      setError('Bitte gib einen gültigen Zahlenwert ein.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: parseFloat(value),
          notes: notes.trim() || undefined
        }),
      });
      
      if (!response.ok) {
        throw new Error('Eintrag konnte nicht gespeichert werden');
      }
      
      setValue('');
      setNotes('');
      router.refresh();
      
      // Optional: Zum Tabellenansicht navigieren
      // router.push('/tabelle');
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      setError('Es ist ein Fehler aufgetreten. Bitte versuche es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Neuer Eintrag</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
            Wert
          </label>
          <input
            type="number"
            id="value"
            step="any"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="z.B. 75.5"
            required
          />
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notizen (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Zusätzliche Informationen..."
            rows={3}
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md text-white font-medium 
            ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} 
            transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {isSubmitting ? 'Wird gespeichert...' : 'Speichern'}
        </button>
      </form>
    </div>
  );
}
