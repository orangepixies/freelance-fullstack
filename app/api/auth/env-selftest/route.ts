import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function GET() {
  const envEmail = process.env.AUTH_EMAIL || ''
  const envHash  = process.env.AUTH_PASSWORD_HASH || ''

  // Tes compare password default UTS yang kamu pakai
  const samplePassword = 'AdminPass123!'
  let bcryptOk = false
  if (envHash) {
    try {
      bcryptOk = await bcrypt.compare(samplePassword, envHash)
    } catch {}
  }

  return NextResponse.json({
    hasEnv: {
      AUTH_EMAIL: !!envEmail,
      AUTH_PASSWORD_HASH: !!envHash,
    },
    email: envEmail || '(empty)',
    bcryptOk, // true artinya hash cocok dengan "AdminPass123!"
  })
}
