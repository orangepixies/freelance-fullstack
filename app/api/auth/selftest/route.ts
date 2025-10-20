// app/api/auth/selftest/route.ts
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
const clean = (v?: string) =>
  (v ?? '').replace(/^\uFEFF/, '').trim().replace(/^['"]|['"]$/g, '')

export async function POST(req: Request) {
  const raw = await req.text()
  let body: any = {}
  try { if (raw) body = JSON.parse(raw) } catch {}
  const { email = '', password = '' } = body

  const envEmail = clean(process.env.AUTH_EMAIL)
  const envPlain = clean(process.env.AUTH_PLAIN_PASS)
  const secretOk = clean(process.env.AUTH_JWT_SECRET).length >= 32

  return NextResponse.json({
    hasEnv: { email: !!envEmail, plain: !!envPlain, secret: secretOk },
    emailMatch: email.toLowerCase() === envEmail.toLowerCase(),
    plainOk: !!envPlain && password === envPlain,
  })
}
