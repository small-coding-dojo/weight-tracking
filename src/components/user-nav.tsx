'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ThemeToggle } from './theme-toggle';
import { Button } from '@/components/ui/Button';

export function UserNav() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle sign out with manual redirection
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  if (status === 'loading') {
    return <div className="h-8 w-8"></div>;
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-white"
        >
          <Link href="/login">
            Log in
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-white border border-gray-300"
        >
          <Link href="/register">
            Register
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative flex items-center" ref={menuRef}>
      <ThemeToggle />
      <Button
        variant="primary"
        size="sm"
        className="ml-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span className="text-sm font-medium truncate max-w-[120px]">
          {session.user?.username || session.user?.email?.split('@')[0]}
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''} ml-1`}
        >
          <path d="M6 9l6 6 6-6"></path>
        </svg>
      </Button>
      
      {isMenuOpen && (
        <div className="absolute right-0 mt-1 bg-white rounded-md shadow-lg py-1 w-48 z-10 top-full">
          <div className="px-3 py-2 text-sm text-gray-500 border-b border-gray-100">
            Signed in as <span className="font-medium text-gray-900">{session.user?.email}</span>
          </div>
          <Link
            href="/settings"
            className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Settings
          </Link>
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full text-left justify-start px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Sign out
          </Button>
        </div>
      )}
    </div>
  );
}