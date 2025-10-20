// app/api/reports/students.csv/route.ts
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
    return new NextResponse('Unauthorized', { status: 401 })
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

  // Build CSV content
  const headers = ['ID', 'NIM', 'Name', 'Program', 'Created At']
  const csvRows = [headers.join(',')]
  
  for (const student of students) {
    const row = [
      student.id,
      student.nim,
      `"${student.name.replace(/"/g, '""')}"`, // Escape quotes in name
      `"${student.program.replace(/"/g, '""')}"`,
      student.createdAt.toISOString(),
    ]
    csvRows.push(row.join(','))
  }

  const csvContent = csvRows.join('\n')

  // Return CSV file
  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="students-report-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
