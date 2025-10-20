// app/api/reports/students.json/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { getUserFromCookie } from '@/lib/auth'

export async function GET(req: NextRequest) {
  // Check authentication
  const store = await cookies()
  const token = store.get('session')?.value
  const user = await getUserFromCookie(token)
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get filter parameters from URL
  const { searchParams } = new URL(req.url)
  const fromStr = searchParams.get('from') || ''
  const toStr = searchParams.get('to') || ''
  const program = searchParams.get('program') || ''

  // Build where clause
  const where: any = {}
  if (program) where.program = program
  if (fromStr || toStr) {
    where.createdAt = {}
    if (fromStr) where.createdAt.gte = new Date(`${fromStr}T00:00:00Z`)
    if (toStr) where.createdAt.lte = new Date(`${toStr}T23:59:59Z`)
  }

  // Fetch students data
  const students = await prisma.student.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })

  // Get summary statistics
  const totalCount = students.length
  const programCounts: Record<string, number> = {}
  
  students.forEach((s: any) => {
    programCounts[s.program] = (programCounts[s.program] || 0) + 1
  })

  // Build response
  const response = {
    success: true,
    exportedAt: new Date().toISOString(),
    filters: {
      from: fromStr || null,
      to: toStr || null,
      program: program || null,
    },
    summary: {
      total: totalCount,
      byProgram: programCounts,
    },
    data: students.map((s: any) => ({
      id: s.id,
      nim: s.nim,
      name: s.name,
      program: s.program,
      createdAt: s.createdAt.toISOString(),
    })),
  }

  // Return JSON with download headers
  return new NextResponse(JSON.stringify(response, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="students-report-${new Date().toISOString().split('T')[0]}.json"`,
    },
  })
}
