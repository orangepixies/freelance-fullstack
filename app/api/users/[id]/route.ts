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

// PUT /api/users/[id]  { email?, role?, password? }
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ ok:false, error:'Forbidden' }, { status:403 })

  const { id: idStr } = await params
  const id = Number(idStr)
  const body = await req.json()
  const data: any = {}
  if (body.email) data.email = String(body.email).toLowerCase()
  if (body.role) {
    if (!['ADMIN','LECTURER','STUDENT'].includes(body.role)) {
      return NextResponse.json({ ok:false, error:'Invalid role' }, { status:400 })
    }
    data.role = body.role
  }
  if (body.password) data.passwordHash = await bcrypt.hash(String(body.password), 10)

  try {
    const upd = await prisma.user.update({ where: { id }, data, select: { id:true, email:true, role:true } })
    return NextResponse.json({ ok:true, item: upd })
  } catch (e:any) {
    const msg = e?.code === 'P2002' ? 'Email already exists' : 'Update failed'
    return NextResponse.json({ ok:false, error: msg }, { status:400 })
  }
}

// DELETE /api/users/[id]
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ ok:false, error:'Forbidden' }, { status:403 })

  const { id: idStr } = await params
  const id = Number(idStr)
  try {
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ ok:true })
  } catch {
    return NextResponse.json({ ok:false, error:'Delete failed' }, { status:400 })
  }
}
