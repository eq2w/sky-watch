import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/' || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }
  return NextResponse.redirect(new URL('/', request.url))
}
export const config = {
  matcher: [
    '/((?!_next/|favicon.ico|.*\\..*).*)',
  ],
}