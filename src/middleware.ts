import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs on the edge before the page is rendered
export function middleware(request: NextRequest) {
  // Check if the request is for the design-system page
  if (request.nextUrl.pathname.startsWith('/design-system')) {
    // If we're in production, redirect to home
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Continue with the request for all other paths or in development mode
  return NextResponse.next();
}

// Configure the paths that this middleware should run on
export const config = {
  matcher: ['/design-system', '/design-system/:path*'],
};