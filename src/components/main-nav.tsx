'use client';

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function MainNav() {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const [isDev, setIsDev] = useState(false);
  
  useEffect(() => {
    // Only show design system link in development mode
    setIsDev(process.env.NODE_ENV === 'development');
  }, []);
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <nav className="flex justify-between">
      <Link 
        href="/" 
        className="px-3 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Input
      </Link>
      <Link 
        href="/table" 
        className="px-3 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Table
      </Link>
      <Link 
        href="/chart" 
        className="px-3 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Chart
      </Link>
      {isDev && (
        <Link 
          href="/design-system" 
          className="px-3 py-2 rounded hover:bg-blue-700 transition-colors text-amber-300"
        >
          Design System
        </Link>
      )}
    </nav>
  );
}