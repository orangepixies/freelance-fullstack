import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const RAW_SECRET = process.env.AUTH_JWT_SECRET || ''
const SECRET = RAW_SECRET ? new TextEncoder().encode(RAW_SECRET) : undefined

type Role = 'ADMIN' | 'LECTURER' | 'STUDENT'
type Payload = { sub: string; role: Role } | null

async function getPayload(token?: string): Promise<Payload> {
  if (!token || !SECRET) return null
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as Payload
  } catch {
    return null
  }
}

function hasPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some(p => pathname === p || pathname.startsWith(p + '/'))
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const isApi = pathname.startsWith('/api/')

  // --- Public/static: biarkan lewat ---
  if (
    pathname === '/' ||
    hasPrefix(pathname, [
      '_next', 'favicon', 'images', // aset
      'about','services','works','tech','process','contact',
      'blog','rss'
    ]) ||
    // API publik:
    hasPrefix(pathname, ['api/news','api/auth']) // /api/news/** dan /api/auth/**
  ) {
    return NextResponse.next()
  }

  // --- Rute yang butuh auth/role ---
  const needAuth = [
    '/dashboard',          // semua role
    '/master',             // ADMIN, LECTURER
    '/reports',            // semua role
    '/users',              // ADMIN
    '/api/students',       // ADMIN, LECTURER (CRUD)
    '/api/users',          // ADMIN
  ]

  if (!hasPrefix(pathname, needAuth)) {
    return NextResponse.next()
  }

  const token = req.cookies.get('session')?.value
  const payload = await getPayload(token)

  // --- Belum login ---
  if (!payload) {
    if (isApi) {
      return new NextResponse(JSON.stringify({ ok: false, error: 'UNAUTHORIZED' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      })
    }
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.search = `?next=${encodeURIComponent(pathname + (search || ''))}`
    return NextResponse.redirect(url)
  }

  const role = payload.role

  // --- Gate per role ---
  if (hasPrefix(pathname, ['/users', '/api/users']) && role !== 'ADMIN') {
    return isApi
      ? new NextResponse(JSON.stringify({ ok: false, error: 'FORBIDDEN' }), {
          status: 403,
          headers: { 'content-type': 'application/json' },
        })
      : NextResponse.redirect(new URL('/dashboard?denied=1', req.url))
  }

  if (hasPrefix(pathname, ['/master', '/api/students']) && !(role === 'ADMIN' || role === 'LECTURER')) {
    return isApi
      ? new NextResponse(JSON.stringify({ ok: false, error: 'FORBIDDEN' }), {
          status: 403,
          headers: { 'content-type': 'application/json' },
        })
      : NextResponse.redirect(new URL('/dashboard?denied=1', req.url))
  }

  // Sudah login tapi menuju /login → lempar ke dashboard
  if (pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

// Matcher kamu boleh tetap seperti ini. Kita filter rute publik/proteksi di dalam fungsi.
export const config = {
  matcher: [
    '/dashboard',
    '/master/:path*',
    '/reports/:path*',
    '/users',
    '/api/students/:path*',
    '/api/users/:path*',
    '/login',
  ],
}
