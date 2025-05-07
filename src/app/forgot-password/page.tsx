'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { Card } from '@/components/ui/Card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to process request');
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
      
      {isSubmitted ? (
        <Alert variant="success" icon={true}>
          <p>If an account exists with that email, you will receive password reset instructions.</p>
          <p className="mt-4">
            <Link href="/login" className="text-blue-600 hover:underline">
              Return to login
            </Link>
          </p>
        </Alert>
      ) : (
        <>
          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}
          
          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                type="email"
                id="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <Button
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
                fullWidth
              >
                Send Reset Link
              </Button>
            </form>
          </Card>
          
          <div className="mt-4 text-center">
            <Link href="/login" className="text-blue-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </>
      )}
    </div>
  );
}