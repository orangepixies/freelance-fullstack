import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const e = String(email || '').trim().toLowerCase()

    const user = await prisma.user.findUnique({ where: { email: e } })
    const bcryptOk = user ? await bcrypt.compare(String(password || ''), user.passwordHash) : false

    return NextResponse.json({
      found: !!user,
      emailQueried: e,
      bcryptOk,
      role: user?.role ?? null,
      // hanya untuk verifikasi, aman ditampilkan sebagian
      hashSample: user?.passwordHash?.slice(0, 10) ?? null,
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
}
