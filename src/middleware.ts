import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const token = request.cookies.get('token')?.value;


  if (!token && (!pathname.includes('/auth'))) {
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (PUBLIC_FILE.test(pathname)) {
    return undefined;
  }

  if (pathname.includes('/api')) {
    return undefined;
  }
}

export const config = {
  matcher: ['/((?!_next).*)'],
};
