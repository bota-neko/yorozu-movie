import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');
const ADMIN_TOKEN_NAME = 'admin_token';
const VIEWER_TOKEN_NAME = 'viewer_authenticated';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      const token = request.cookies.get(ADMIN_TOKEN_NAME)?.value;
      if (token) {
        try {
          await jwtVerify(token, SECRET);
          return NextResponse.redirect(new URL('/admin', request.url));
        } catch (e) {
          // invalid token, proceed to login
        }
      }
      return NextResponse.next();
    }

    const token = request.cookies.get(ADMIN_TOKEN_NAME)?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch (e) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Video routes
  if (pathname.startsWith('/videos')) {
    const viewerAuth = request.cookies.get(VIEWER_TOKEN_NAME)?.value;
    if (!viewerAuth) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Note: We don't verify against DB here for performance, 
    // but the actual page rendering will check if the hash still matches if needed.
    // Or we can just trust the cookie for middleware and check in Server Components.
    return NextResponse.next();
  }

  // Home page (Password entry)
  if (pathname === '/') {
    const viewerAuth = request.cookies.get(VIEWER_TOKEN_NAME)?.value;
    if (viewerAuth) {
      return NextResponse.redirect(new URL('/videos', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/videos/:path*', '/'],
};
