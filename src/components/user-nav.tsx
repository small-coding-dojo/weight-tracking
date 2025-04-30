'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

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
        <Link href="/login" className="text-sm font-medium hover:underline">
          Log in
        </Link>
        <Link 
          href="/register" 
          className="text-sm bg-white text-blue-600 font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors"
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center space-x-1 bg-blue-700 hover:bg-blue-800 rounded px-3 py-1"
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
          className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6"></path>
        </svg>
      </button>
      
      {isMenuOpen && (
        <div className="absolute right-0 mt-1 bg-white rounded-md shadow-lg py-1 w-48 z-10">
          <div className="px-3 py-2 text-sm text-gray-500 border-b border-gray-100">
            Signed in as <span className="font-medium text-gray-900">{session.user?.email}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}