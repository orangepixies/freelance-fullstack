import { cookies } from 'next/headers'
import { verifySession } from '@/lib/jwt'
import Link from 'next/link'

export default async function AdminPage() {
  const store = await cookies()
  const token = store.get('session')?.value || ''
  const session = await verifySession(token)

  return (
    <main className="container py-10">
      <h1 className="text-3xl font-extrabold mb-2">Admin</h1>
      <p className="text-muted mb-6">Welcome {session?.sub ?? 'Admin'}.</p>

      <div className="flex gap-3">
        <form action="/api/auth/logout" method="post">
          <button className="btn">Log out</button>
        </form>
        <Link href="/" className="btn">Go Home</Link>
      </div>

      {/* Nanti di sini kita tambah Control Panel (manage news, posts, dsb.) */}
    </main>
  )
}
