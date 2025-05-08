'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { Card } from '@/components/ui/Card';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const primaryText = useThemeColor('Text', 'Primary');
  const onSecondaryText = useThemeColor('On', 'Secondary');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false
      });

      if (result?.error) {
        setError('Invalid username or password');
        return;
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      setError('An error occurred during login');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Log In</h1>
      
      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            type="text"
            id="username"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          <FormInput
            type="password"
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Button
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            fullWidth
          >
            Log In
          </Button>
        </form>
      </Card>
      
      <div className="mt-4 text-center">
        <p className={onSecondaryText}>
          Don&apos;t have an account?{' '}
          <Link href="/register" className={`${primaryText} hover:underline`}>
            Register
          </Link>
        </p>
        <p>
          <Link href="/forgot-password" className={`${primaryText} hover:underline`}>
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  );
}