import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserFromCookie } from '@/lib/auth'

type Role = 'ADMIN' | 'LECTURER' | 'STUDENT'

export default async function Dashboard() {
  // auth gate (server component)
  const store = await cookies()
  const token = store.get('session')?.value
  const user = await getUserFromCookie(token)
  if (!user) redirect('/login')

  const role = (user.role || 'STUDENT') as Role

  // definisi menu dashboard
  const modules = [
    {
      href: '/master',
      label: 'Master Data',
      desc: 'CRUD data mahasiswa',
      roles: ['ADMIN', 'LECTURER'] as Role[],
    },
    {
      href: '/reports',
      label: 'Reports',
      desc: 'Rekap & ringkasan data',
      roles: ['ADMIN', 'LECTURER', 'STUDENT'] as Role[],
    },
    {
      href: '/users',
      label: 'Users',
      desc: 'Kelola akun & role',
      roles: ['ADMIN'] as Role[],
    },
  ]

  const visible = modules.filter(m => m.roles.includes(role))

  return (
    <main className="container py-10">
      {/* header kecil sesuai ketentuan: username (email), daftar menu, signout */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted">Signed in as <span className="font-medium">{user.email}</span> · Role: <span className="font-medium">{role}</span></p>
        </div>

        {/* sign out pakai endpoint POST /api/auth/logout */}
        <form action="/api/auth/logout" method="post">
          <button className="btn">Sign out</button>
        </form>
      </div>

      {/* menu sesuai role */}
      <section className="mt-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map(m => (
            <Link key={m.href} href={m.href as any} className="card p-5 hover:ring-1 hover:ring-accent/40 transition">
              <div className="text-xl font-semibold mb-1">{m.label}</div>
              <div className="text-muted">{m.desc}</div>
              <div className="mt-3 text-accent text-sm">Open →</div>
            </Link>
          ))}

          {/* fallback kalau role tidak punya menu khusus */}
          {visible.length === 0 && (
            <div className="card p-5">
              <div className="font-semibold">No modules available</div>
              <div className="text-muted text-sm">Hubungi admin untuk akses.</div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
