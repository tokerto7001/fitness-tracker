import { NextResponse, NextRequest } from 'next/server'
import { updateSession } from '@/utils/middleware'

export async function middleware(request: NextRequest) {
  const userSession = await updateSession(request)

  if(request.nextUrl.pathname.startsWith('/signin') || request.nextUrl.pathname.startsWith('/signup')) {
    if(userSession) return NextResponse.redirect(new URL('/', request.url));
    else return NextResponse.next();
  } else if(request.nextUrl.pathname.startsWith('/api/auth/confirm')) {
    return NextResponse.next();
  } else {
    if(!userSession) return NextResponse.redirect(new URL('/signin', request.url));
    else return NextResponse.next()
  }

}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}