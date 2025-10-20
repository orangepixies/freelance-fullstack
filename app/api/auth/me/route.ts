import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/lib/auth-db'

export async function GET() {
  const cookie = (await cookies()).get('session')?.value
  const user = await verifySessionToken(cookie)
  if (!user) return NextResponse.json({ ok: false }, { status: 401 })
  return NextResponse.json({ ok: true, user })
}
