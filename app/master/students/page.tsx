'use client'

import { useEffect, useState } from 'react'

type Student = { id:number; nim:string; name:string; program:string }

export default function StudentsPage(){
  const [items, setItems] = useState<Student[]>([])
  const [q, setQ] = useState('')
  const [form, setForm] = useState<Partial<Student>>({})
  const [editing, setEditing] = useState<Student|null>(null)
  const [msg, setMsg] = useState<string>('')

  async function load() {
    const r = await fetch('/api/students?q=' + encodeURIComponent(q))
    const j = await r.json()
    if (j.ok) setItems(j.items)
  }
  useEffect(()=>{ load() }, [q])

  function validate(s: Partial<Student>) {
    if (!s.nim || s.nim.length < 4) return 'NIM minimal 4 karakter'
    if (!s.name || s.name.length < 3) return 'Nama minimal 3 karakter'
    if (!s.program) return 'Program wajib diisi'
    return ''
  }

  async function submitNew(e: React.FormEvent) {
    e.preventDefault()
    const v = validate(form)
    if (v) return setMsg(v)
    const r = await fetch('/api/students', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
    const j = await r.json()
    if (!j.ok) return setMsg(j.error||'Create failed')
    setForm({}); setMsg('Created'); load()
  }

  async function submitEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return
    const v = validate(editing)
    if (v) return setMsg(v)
    const r = await fetch(`/api/students/${editing.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(editing) })
    const j = await r.json()
    if (!j.ok) return setMsg(j.error||'Update failed')
    setEditing(null); setMsg('Updated'); load()
  }

  async function del(id:number) {
    if (!confirm('Delete this student?')) return
    const r = await fetch(`/api/students/${id}`, { method:'DELETE' })
    const j = await r.json()
    if (!j.ok) return setMsg(j.error||'Delete failed')
    setMsg('Deleted'); load()
  }

  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold">Master: Students</h1>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {/* Create */}
        <form onSubmit={submitNew} className="card p-6">
          <div className="text-lg font-semibold mb-3">Add New</div>
          <input className="card px-4 py-3 mb-2" placeholder="NIM"
                 value={form.nim||''} onChange={e=>setForm(f=>({...f, nim:e.target.value}))}/>
          <input className="card px-4 py-3 mb-2" placeholder="Name"
                 value={form.name||''} onChange={e=>setForm(f=>({...f, name:e.target.value}))}/>
          <input className="card px-4 py-3 mb-2" placeholder="Program"
                 value={form.program||''} onChange={e=>setForm(f=>({...f, program:e.target.value}))}/>
          <button className="btn">Create</button>
        </form>

        {/* Edit */}
        <form onSubmit={submitEdit} className="card p-6">
          <div className="text-lg font-semibold mb-3">Edit</div>
          <input className="card px-4 py-3 mb-2" placeholder="NIM" value={editing?.nim||''}
                 onChange={e=>setEditing(s=>s?{...s, nim:e.target.value}:s)}/>
          <input className="card px-4 py-3 mb-2" placeholder="Name" value={editing?.name||''}
                 onChange={e=>setEditing(s=>s?{...s, name:e.target.value}:s)}/>
          <input className="card px-4 py-3 mb-2" placeholder="Program" value={editing?.program||''}
                 onChange={e=>setEditing(s=>s?{...s, program:e.target.value}:s)}/>
          <button className="btn" disabled={!editing}>Update</button>
        </form>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-2">
          <input className="card px-4 py-3 w-80" placeholder="Search (name/nim/program)…" value={q} onChange={e=>setQ(e.target.value)}/>
          {msg && <div className="text-sm text-muted">{msg}</div>}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-line">
                <th className="py-2 pr-3">ID</th>
                <th className="py-2 pr-3">NIM</th>
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Program</th>
                <th className="py-2 pr-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(s=>(
                <tr key={s.id} className="border-b border-line/60">
                  <td className="py-2 pr-3">{s.id}</td>
                  <td className="py-2 pr-3">{s.nim}</td>
                  <td className="py-2 pr-3">{s.name}</td>
                  <td className="py-2 pr-3">{s.program}</td>
                  <td className="py-2 pr-3">
                    <button className="btn mr-2" onClick={()=>setEditing(s)}>Edit</button>
                    <button className="btn" onClick={()=>del(s.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {items.length===0 && <tr><td className="py-4 text-muted" colSpan={5}>No data</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
