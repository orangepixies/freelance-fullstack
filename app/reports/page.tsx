// app/reports/page.tsx
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserFromCookie } from '@/lib/auth'
import FilterBar from './FilterBar'

function fmt(dt: Date) {
  const y = dt.getFullYear()
  const m = String(dt.getMonth() + 1).padStart(2, '0')
  const d = String(dt.getDate()).padStart(2, '0')
  const hh = String(dt.getHours()).padStart(2, '0')
  const mm = String(dt.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}`
}

type SearchParams = { [key: string]: string | string[] | undefined }

export default async function ReportsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  // ── Auth (semua role boleh, tapi wajib login)
  const store = await cookies()
  const token = store.get('session')?.value
  const user = await getUserFromCookie(token)
  if (!user) redirect('/login')

  // ── Await searchParams
  const params = await searchParams

  // ── Normalisasi filter dari URL
  const fromStr = typeof params.from === 'string' ? params.from : ''
  const toStr = typeof params.to === 'string' ? params.to : ''
  const program = typeof params.program === 'string' ? params.program : ''

  // ── Build where Prisma dari filter
  const where: any = {}
  if (program) where.program = program
  if (fromStr || toStr) {
    where.createdAt = {}
    if (fromStr) where.createdAt.gte = new Date(`${fromStr}T00:00:00Z`)
    if (toStr) where.createdAt.lte = new Date(`${toStr}T23:59:59Z`)
  }

  // ── Dapatkan daftar program untuk dropdown
  const programRows = await prisma.student.findMany({
    select: { program: true },
    distinct: ['program'],
  })
  const programs = programRows.map((r: any) => r.program).sort((a: string, b: string) => a.localeCompare(b))

  // ── Query ringkasan & data sesuai filter
  const [totalStudents, byProgram, recent] = await Promise.all([
    prisma.student.count({ where }),
    prisma.student.groupBy({
      by: ['program'],
      where,
      _count: { program: true },
      orderBy: { _count: { program: 'desc' } },
    }),
    prisma.student.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
  ])

  const newest = recent[0] || null

  // ── Build URL export (ikut filter aktif)
  const q = new URLSearchParams()
  if (fromStr) q.set('from', fromStr)
  if (toStr) q.set('to', toStr)
  if (program) q.set('program', program)
  const qs = q.toString()
  const exportCsvUrl = `/api/reports/students.csv${qs ? `?${qs}` : ''}`
  const exportJsonUrl = `/api/reports/students.json${qs ? `?${qs}` : ''}`

  return (
    <main className="container py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-muted">
            Signed in as <span className="font-medium">{user.email}</span> · Role:{' '}
            <span className="font-medium">{String(user.role || '').toUpperCase()}</span>
          </p>

          {/* Ringkasan filter aktif */}
          {(fromStr || toStr || program) && (
            <div className="mt-2 text-xs text-muted">
              Filters:&nbsp;
              {fromStr ? <span className="mr-2">from <b>{fromStr}</b></span> : null}
              {toStr ? <span className="mr-2">to <b>{toStr}</b></span> : null}
              {program ? <span className="mr-2">program <b>{program}</b></span> : null}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <a href={exportCsvUrl} className="btn">Export CSV</a>
          <a href={exportJsonUrl} className="btn">Export JSON</a>
          <form action="/api/auth/logout" method="post">
            <button className="btn">Sign out</button>
          </form>
        </div>
      </div>

      {/* Filter bar */}
      <div className="mt-6">
        <FilterBar programs={programs} />
      </div>

      {/* Ringkasan */}
      <section className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-sm text-muted">Total Students (filtered)</div>
          <div className="text-3xl font-bold mt-1">{totalStudents}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-muted">Programs (in result)</div>
          <div className="text-3xl font-bold mt-1">{byProgram.length}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-muted">Newest Entry</div>
          <div className="mt-1">
            {newest ? (
              <>
                <div className="font-semibold">{newest.name}</div>
                <div className="text-xs text-muted">
                  {newest.program} · {fmt(newest.createdAt)}
                </div>
              </>
            ) : (
              <div className="text-sm text-muted">—</div>
            )}
          </div>
        </div>
      </section>

      {/* Distribusi Program */}
      <section className="mt-8">
        <div className="card p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-line font-semibold">
            Program Distribution
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left bg-white/5">
                  <th className="px-4 py-2">Program</th>
                  <th className="px-4 py-2 w-40">Count</th>
                </tr>
              </thead>
              <tbody>
                {byProgram.map((row: any) => (
                  <tr key={row.program} className="border-t border-white/5">
                    <td className="px-4 py-2">{row.program}</td>
                    <td className="px-4 py-2">{row._count.program}</td>
                  </tr>
                ))}
                {byProgram.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-muted" colSpan={2}>
                      No data yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 20 Data Terbaru */}
      <section className="mt-8">
        <div className="card p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-line font-semibold">
            Recent Students (Last 20)
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left bg-white/5">
                  <th className="px-4 py-2">NIM</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Program</th>
                  <th className="px-4 py-2 w-56">Created At</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((s: any) => (
                  <tr key={s.id} className="border-t border-white/5">
                    <td className="px-4 py-2 font-mono">{s.nim}</td>
                    <td className="px-4 py-2">{s.name}</td>
                    <td className="px-4 py-2">{s.program}</td>
                    <td className="px-4 py-2">{fmt(s.createdAt)}</td>
                  </tr>
                ))}
                {recent.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-muted" colSpan={4}>
                      No data yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  )
}
