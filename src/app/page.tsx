'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Alert } from '@/components/ui/Alert';
import { FormInput } from '@/components/ui/FormInput';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const primaryBorder = useThemeColor('Border', 'Primary');
  const onSecondary = useThemeColor('On', 'Secondary');

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Display loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center p-8">
        <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${primaryBorder}`}></div>
      </div>
    );
  }

  // Don't render the form if not authenticated
  if (!session) {
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate input
      const numberValue = parseFloat(value);
      if (isNaN(numberValue)) {
        throw new Error('Please enter a valid number');
      }

      // Submit to API
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: numberValue, notes }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save entry');
      }

      // Success!
      setValue('');
      setNotes('');
      setSuccess('Entry saved successfully!');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className={`text-2xl font-bold mb-6 ${onSecondary}`}>Data Entry</h1>
      
      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" className="mb-4">
          {success}
        </Alert>
      )}
      
       <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            type="number"
            id="value"
            label="Value"
            step="any"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a value"
            required
          />
          <FormInput
            type="text"
            id="notes"
            label="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any relevant notes"
            className={`w-full px-4 py-2 border rounded-md`}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            fullWidth
          >
            Save Entry
          </Button>
        </form>
      </Card>
    </div>
  );
}
