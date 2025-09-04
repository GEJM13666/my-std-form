import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  // ต้องล็อกอินจึงเข้า /dashboard หรือ /profile ได้
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/profile')) && !token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // ป้องกันหน้า UI ของ Admin (/admin)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  // ป้องกัน API ของ Admin (/api/admin)
  if (pathname.startsWith('/api/admin')) {
    if (!token || token.role !== 'admin') {
      // สำหรับ API, ตอบกลับด้วย JSON error จะดีกว่า redirect
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/profile/:path*', '/api/admin/:path*'],
}
