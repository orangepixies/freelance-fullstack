import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.AUTH_JWT_SECRET || '')

async function requireAdmin() {
  const store = await cookies()
  const token = store.get('session')?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload?.role === 'ADMIN' ? payload : null
  } catch { return null }
}

// GET /api/users?q=&role=
export async function GET(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ ok:false, error:'Forbidden' }, { status:403 })

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim() || ''
  const role = searchParams.get('role')?.trim() || ''
  const where: any = {}
  if (q) where.email = { contains: q }
  if (role) where.role = role

  const items = await prisma.user.findMany({
    where, orderBy: { createdAt: 'desc' },
    select: { id:true, email:true, role:true, createdAt:true }
  })
  return NextResponse.json({ ok:true, items })
}

// POST /api/users  { email, password, role }
export async function POST(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ ok:false, error:'Forbidden' }, { status:403 })

  const { email, password, role } = await req.json()
  if (!email || !password || !role) {
    return NextResponse.json({ ok:false, error:'All fields required' }, { status:400 })
  }
  if (!['ADMIN','LECTURER','STUDENT'].includes(role)) {
    return NextResponse.json({ ok:false, error:'Invalid role' }, { status:400 })
  }
  const passwordHash = await bcrypt.hash(password, 10)
  try {
    const created = await prisma.user.create({
      data: { email: String(email).toLowerCase(), passwordHash, role }
    })
    return NextResponse.json({ ok:true, item: { id: created.id, email: created.email, role: created.role }})
  } catch (e:any) {
    const msg = e?.code === 'P2002' ? 'Email already exists' : 'Create failed'
    return NextResponse.json({ ok:false, error: msg }, { status:400 })
  }
}
