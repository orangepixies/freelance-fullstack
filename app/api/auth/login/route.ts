import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyCredentials, createSessionToken } from '@/lib/auth-db'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')

  const user = await verifyCredentials(email, password)
  if (!user) return NextResponse.json({ ok: false, error: 'Invalid email or password' }, { status: 401 })

  const token = await createSessionToken(user)
  ;(await cookies()).set('session', token, {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7,
  })

  return NextResponse.json({ ok: true, user })
}
