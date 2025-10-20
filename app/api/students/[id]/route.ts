import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params
  const id = Number(idStr)
  const { nim, name, program } = await req.json()
  if (!id || !nim || !name || !program) return NextResponse.json({ ok:false, error:'Invalid payload' }, { status:400 })
  try {
    const updated = await prisma.student.update({ where: { id }, data: { nim, name, program } })
    return NextResponse.json({ ok:true, item: updated })
  } catch (e:any) {
    const msg = e?.code === 'P2002' ? 'NIM already exists' : 'Update failed'
    return NextResponse.json({ ok:false, error: msg }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params
  const id = Number(idStr)
  if (!id) return NextResponse.json({ ok:false, error:'Invalid id' }, { status:400 })
  try {
    await prisma.student.delete({ where: { id } })
    return NextResponse.json({ ok:true })
  } catch {
    return NextResponse.json({ ok:false, error:'Delete failed' }, { status:400 })
  }
}
