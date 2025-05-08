'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { Card } from '@/components/ui/Card';
import { useThemeColor } from '@/hooks/useThemeColor';

// Create a component that uses useSearchParams
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const primaryText = useThemeColor('Text', 'Primary');

  useEffect(() => {
    // Get token from URL query parameter
    const tokenParam = searchParams?.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate token exists
    if (!token) {
      setError('Missing reset token');
      setIsLoading(false);
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setIsSuccess(true);
      // After a successful password reset, clear the form
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error instanceof Error ? error.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !isSuccess) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Alert variant="error">
          <p>Missing reset token. Please ensure you used the complete link from the email.</p>
          <p className="mt-4">
            <Link href="/forgot-password" className={`${primaryText} hover:underline`}>
              Request a new password reset
            </Link>
          </p>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Set New Password</h1>
      
      {isSuccess ? (
        <Alert variant="success" icon={true}>
          <p>Your password has been successfully reset.</p>
          <p className="mt-4">
            <Link href="/login" className={`${primaryText} hover:underline`}>
              Go to login
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
                type="password"
                id="password"
                label="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
              
              <FormInput
                type="password"
                id="confirmPassword"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                required
              />
              
              <Button
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
                fullWidth
              >
                Reset Password
              </Button>
            </form>
          </Card>
        </>
      )}
    </div>
  );
}

// Loading fallback for Suspense
function LoadingFallback() {
  const primaryBorder = useThemeColor('Border', 'Primary');
  return (
    <div className="flex justify-center items-center p-8">
      <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${primaryBorder}`}></div>
    </div>
  );
}

// Main component wrapped in Suspense
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}