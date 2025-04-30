'use client';

import Link from "next/link";
import { useSession } from "next-auth/react";

export function MainNav() {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
  
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
    </nav>
  );
}