// app/api/students/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { getUserFromCookie } from '@/lib/auth-token'
import { z } from 'zod'

// payload validator
const StudentSchema = z.object({
  nim: z.string().min(4).max(32),
  name: z.string().min(2).max(100),
  program: z.string().min(2).max(100),
})

export async function POST(req: Request) {
  // 1) parse + validate
  const json = await req.json().catch(() => null)
  const parsed = StudentSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Invalid payload', issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  // 2) auth + role check (ADMIN, LECTURER)
  const jar = await cookies()
  const token = jar.get('session')?.value
  const user = await getUserFromCookie(token)
  if (!user) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  const role = String(user.role || '').toUpperCase()
  if (!(role === 'ADMIN' || role === 'LECTURER')) {
    return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
  }

  // 3) create
  try {
    const created = await prisma.student.create({ data: parsed.data })
    return NextResponse.json({ ok: true, data: created }, { status: 201 })
  } catch (e: any) {
    // Prisma unique violation (nim)
    if (e?.code === 'P2002') {
      return NextResponse.json({ ok: false, error: 'NIM already exists' }, { status: 409 })
    }
    console.error('POST /api/students error:', e)
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
