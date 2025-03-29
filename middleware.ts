import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/sitemap.xml') {
    // /api/sitemap'e yönlendir
    return NextResponse.rewrite(new URL('/api/sitemap', request.url));
  }

  if (pathname === '/sitemap.xml') {
    // /api/sitemap'e yönlendir
    return NextResponse.rewrite(new URL('/api/sitemap_blog', request.url));
  }

  // diğer istekler normal devam etsin
  return NextResponse.next();
}
