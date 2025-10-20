// Debug endpoint: cek koneksi DB & verifikasi bcrypt langsung ke DB
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// hindari new PrismaClient berulang saat HMR
const prisma = (globalThis as any).prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') (globalThis as any).prisma = prisma

export async function GET() {
  try {
    // Jangan bocorkan env mentah; cukup boolean & host masked
    const masked = (u: string | undefined) => {
      if (!u) return null
      const at = u.split('@')
      return at.length > 1 ? at[1] : '(set)'
    }
    const count = await prisma.user.count().catch(() => -1)
    return NextResponse.json({
      ok: true,
      hasEnv: { DATABASE_URL: Boolean(process.env.DATABASE_URL) },
      dbHost: masked(process.env.DATABASE_URL || undefined),
      userCount: count
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const mail = String(email || '').trim().toLowerCase()
    const pass = String(password || '').trim()
    if (!mail || !pass) {
      return NextResponse.json({ ok: false, step: 'input', error: 'missing email/password' }, { status: 400 })
    }
    const u = await prisma.user.findUnique({ where: { email: mail } })
    if (!u) return NextResponse.json({ ok: false, step: 'findUnique', error: 'user not found' }, { status: 404 })
    const ok = await bcrypt.compare(pass, u.passwordHash)
    return NextResponse.json({ ok, step: 'bcrypt.compare', role: u.role })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'error' }, { status: 500 })
  }
}
