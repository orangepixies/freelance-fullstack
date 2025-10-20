// app/api/reports/export/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth'

function toCSV(rows: Record<string, any>[]) {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const esc = (v: any) => {
    if (v instanceof Date) v = v.toISOString()
    if (v === null || v === undefined) v = ''
    v = String(v)
    // wrap with quotes & escape inner quotes
    return `"${v.replace(/"/g, '""')}"`
  }
  const lines = [
    headers.join(','), // header
    ...rows.map(r => headers.map(h => esc(r[h])).join(',')),
  ]
  return lines.join('\n')
}

export async function GET(req: Request) {
  // ── simple auth (biar konsisten dengan /reports)
  const store = await cookies()
  const token = store.get('session')?.value
  const user = await getUserFromCookie(token)
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const type = (searchParams.get('type') || 'distribution').toLowerCase()
  const limit = Math.min(parseInt(searchParams.get('limit') || '200', 10), 1000)

  let filename = ''
  let csv = ''

  if (type === 'distribution') {
    const byProgram = await prisma.student.groupBy({
      by: ['program'],
      _count: { program: true },
      orderBy: { _count: { program: 'desc' } },
    })

    const rows = byProgram.map((r: any) => ({ program: r.program, count: r._count.program }))
    csv = toCSV(rows)
    filename = `program_distribution_${new Date().toISOString().slice(0, 19)}.csv`
  } else if (type === 'recent') {
    const recent = await prisma.student.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: { nim: true, name: true, program: true, createdAt: true },
    })
    csv = toCSV(recent)
    filename = `recent_students_${new Date().toISOString().slice(0, 19)}.csv`
  } else {
    return NextResponse.json({ ok: false, error: 'Invalid type' }, { status: 400 })
  }

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename.replace(/\s/g, '_')}"`,
      'Cache-Control': 'no-store',
    },
  })
}
