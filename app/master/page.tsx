// app/master/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth'

// ────────────────────── Server Actions ──────────────────────
async function addStudent(formData: FormData) {
  'use server'
  const nim = String(formData.get('nim') || '').trim()
  const name = String(formData.get('name') || '').trim()
  const program = String(formData.get('program') || '').trim()

  if (!nim || !name || !program) {
    redirect(`/master?error=${encodeURIComponent('All fields are required')}`)
  }

  try {
    await prisma.student.create({ data: { nim, name, program } })
  } catch (e: any) {
    const msg = e?.code === 'P2002' ? 'NIM already exists' : 'Failed to create student'
    redirect(`/master?error=${encodeURIComponent(msg)}`)
  }

  revalidatePath('/master')
  redirect('/master?ok=1')
}

async function updateStudent(formData: FormData) {
  'use server'
  const id = Number(formData.get('id') || NaN)
  const nim = String(formData.get('nim') || '').trim()
  const name = String(formData.get('name') || '').trim()
  const program = String(formData.get('program') || '').trim()

  if (!id || Number.isNaN(id)) redirect(`/master?error=${encodeURIComponent('Invalid ID')}`)
  if (!nim || !name || !program) redirect(`/master?edit=${id}&error=${encodeURIComponent('All fields are required')}`)

  try {
    await prisma.student.update({
      where: { id },
      data: { nim, name, program },
    })
  } catch (e: any) {
    const msg = e?.code === 'P2002' ? 'NIM already exists' : 'Failed to update student'
    redirect(`/master?edit=${id}&error=${encodeURIComponent(msg)}`)
  }

  revalidatePath('/master')
  redirect('/master?updated=1')
}

async function deleteStudent(formData: FormData) {
  'use server'
  const id = Number(formData.get('id') || NaN)
  if (!id || Number.isNaN(id)) redirect(`/master?error=${encodeURIComponent('Invalid ID')}`)

  try {
    await prisma.student.delete({ where: { id } })
  } catch {
    redirect(`/master?error=${encodeURIComponent('Failed to delete student')}`)
  }

  revalidatePath('/master')
  redirect('/master?deleted=1')
}

// ────────────────────── Page (Server Component) ──────────────────────
type SP = Record<string, string | undefined>

export default async function MasterPage({
  searchParams,
}: {
  searchParams: Promise<SP>
}) {
  // Auth: hanya ADMIN & LECTURER
  const store = await cookies()
  const token = store.get('session')?.value
  const user = await getUserFromCookie(token)
  if (!user) redirect('/login')
  const role = String(user.role || '').toUpperCase()
  if (role !== 'ADMIN' && role !== 'LECTURER') redirect('/dashboard?denied=1')

  const sp = await searchParams
  const ok = sp.ok === '1'
  const updated = sp.updated === '1'
  const deleted = sp.deleted === '1'
  const error = sp.error

  const students = await prisma.student.findMany({ orderBy: { createdAt: 'desc' } })

  const editId = sp.edit ? Number(sp.edit) : undefined
  const editing =
    editId && !Number.isNaN(editId)
      ? await prisma.student.findUnique({ where: { id: editId } })
      : null

  return (
    <main className="container py-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold">Master Data — Students</h1>
          <p className="text-sm text-muted">
            Signed in as <span className="font-medium">{user.email}</span> · Role:{' '}
            <span className="font-medium">{role}</span>
          </p>
        </div>

        <form action="/api/auth/logout" method="post">
          <button className="btn">Sign out</button>
        </form>
      </div>

      {/* Alerts */}
      <div className="mt-4 space-y-3">
        {ok && (
          <div className="card border border-emerald-600/40 bg-emerald-600/10 p-3 text-sm">
            Student created successfully.
          </div>
        )}
        {updated && (
          <div className="card border border-sky-600/40 bg-sky-600/10 p-3 text-sm">
            Student updated successfully.
          </div>
        )}
        {deleted && (
          <div className="card border border-amber-600/40 bg-amber-600/10 p-3 text-sm">
            Student deleted.
          </div>
        )}
        {error && (
          <div className="card border border-rose-600/40 bg-rose-600/10 p-3 text-sm">
            {error}
          </div>
        )}
      </div>

      <section className="mt-8 grid lg:grid-cols-3 gap-8">
        {/* Table */}
        <div className="lg:col-span-2">
          <div className="card p-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-line font-semibold">
              Students
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left bg-white/5">
                    <th className="px-4 py-2">NIM</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Program</th>
                    <th className="px-4 py-2 w-36">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s: any) => (
                    <tr key={s.id} className="border-t border-white/5">
                      <td className="px-4 py-2 font-mono">{s.nim}</td>
                      <td className="px-4 py-2">{s.name}</td>
                      <td className="px-4 py-2">{s.program}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-3">
                          <a
                            href={`/master?edit=${s.id}`}
                            className="text-accent hover:underline"
                          >
                            Edit
                          </a>
                          <form action={deleteStudent}>
                            <input type="hidden" name="id" value={s.id} />
                            <button
                              className="text-rose-400 hover:underline"
                              aria-label={`Delete ${s.name}`}
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td className="px-4 py-6 text-muted" colSpan={4}>
                        No data yet. Add the first student on the right.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column: Create OR Edit form */}
        <div>
          <div className="card p-5">
            {!editing ? (
              <>
                <div className="text-lg font-semibold mb-3">Add Student</div>
                <form action={addStudent} className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">NIM</label>
                    <input
                      name="nim"
                      required
                      minLength={6}
                      className="input w-full"
                      placeholder="23001234"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Name</label>
                    <input
                      name="name"
                      required
                      className="input w-full"
                      placeholder="Budi Santoso"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Program</label>
                    <input
                      name="program"
                      required
                      className="input w-full"
                      placeholder="Informatics"
                    />
                  </div>
                  <button className="btn w-full" type="submit">
                    Save
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="text-lg font-semibold mb-3">Edit Student</div>
                <form action={updateStudent} className="space-y-4">
                  <input type="hidden" name="id" value={editing.id} />
                  <div>
                    <label className="block text-sm mb-1">NIM</label>
                    <input
                      name="nim"
                      required
                      minLength={6}
                      defaultValue={editing.nim}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Name</label>
                    <input
                      name="name"
                      required
                      defaultValue={editing.name}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Program</label>
                    <input
                      name="program"
                      required
                      defaultValue={editing.program}
                      className="input w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button className="btn" type="submit">
                      Update
                    </button>
                    <a href="/master" className="btn-secondary">
                      Cancel
                    </a>
                    <form action={deleteStudent} className="ml-auto">
                      <input type="hidden" name="id" value={editing.id} />
                      <button className="btn-danger" type="submit">
                        Delete
                      </button>
                    </form>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
