import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/signup', '/api/auth/session', '/api/auth/verify-session'];

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const pathname = request.nextUrl.pathname;

  // Allow public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Redirect to login if no session exists
  if (!session) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/ (API routes)
     * 2. /_next/ (Next.js internals)
     * 3. /fonts/ (inside public directory)
     * 4. /favicon.ico, /site.webmanifest (static files)
     */
    '/((?!_next|fonts|favicon.ico|site.webmanifest).*)',
  ],
}; 