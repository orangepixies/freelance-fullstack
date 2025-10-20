'use client'

import { useEffect, useState } from 'react'

type Role = 'ADMIN'|'LECTURER'|'STUDENT'
type User = { id:number; email:string; role:Role; createdAt?:string }

export default function UsersAdminPage(){
  const [items, setItems] = useState<User[]>([])
  const [q, setQ] = useState('')
  const [role, setRole] = useState<Role|''>('')

  const [createForm, setCreateForm] = useState<{email:string; password:string; role:Role}>({ email:'', password:'', role:'STUDENT' })
  const [edit, setEdit] = useState<User|null>(null)
  const [pwd, setPwd] = useState('') // optional new password
  const [msg, setMsg] = useState('')

  async function load(){
    const r = await fetch(`/api/users?q=${encodeURIComponent(q)}&role=${role||''}`)
    if (r.ok) {
      const j = await r.json()
      setItems(j.items || [])
    }
  }
  useEffect(()=>{ load() }, [q, role])

  async function createUser(e:React.FormEvent){
    e.preventDefault()
    setMsg('')
    if (!createForm.email || !createForm.password) return setMsg('Email & password required')
    const r = await fetch('/api/users', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(createForm) })
    const j = await r.json()
    if (!j.ok) return setMsg(j.error||'Create failed')
    setCreateForm({ email:'', password:'', role:'STUDENT' })
    setMsg('User created'); load()
  }

  async function updateUser(e:React.FormEvent){
    e.preventDefault()
    if (!edit) return
    const payload:any = { email: edit.email, role: edit.role }
    if (pwd) payload.password = pwd
    const r = await fetch(`/api/users/${edit.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    const j = await r.json()
    if (!j.ok) return setMsg(j.error||'Update failed')
    setEdit(null); setPwd(''); setMsg('Updated'); load()
  }

  async function del(id:number){
    if (!confirm('Delete this user?')) return
    const r = await fetch(`/api/users/${id}`, { method:'DELETE' })
    const j = await r.json()
    if (!j.ok) return setMsg(j.error||'Delete failed')
    setMsg('Deleted'); load()
  }

  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold">Users (Admin)</h1>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <input className="card px-4 py-3 w-64" placeholder="Search email…" value={q} onChange={e=>setQ(e.target.value)} />
        <select className="card px-3 py-3" value={role} onChange={e=>setRole(e.target.value as Role| '')}>
          <option value="">All roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="LECTURER">LECTURER</option>
          <option value="STUDENT">STUDENT</option>
        </select>
        {msg && <div className="text-sm text-muted">{msg}</div>}
      </div>

      {/* Create */}
      <form onSubmit={createUser} className="card p-6 mt-6">
        <div className="text-lg font-semibold mb-3">Create user</div>
        <div className="grid md:grid-cols-4 gap-3">
          <input className="card px-4 py-3" placeholder="Email" value={createForm.email} onChange={e=>setCreateForm(f=>({...f, email:e.target.value}))}/>
          <input className="card px-4 py-3" type="password" placeholder="Password" value={createForm.password} onChange={e=>setCreateForm(f=>({...f, password:e.target.value}))}/>
          <select className="card px-3 py-3" value={createForm.role} onChange={e=>setCreateForm(f=>({...f, role:e.target.value as Role}))}>
            <option value="STUDENT">STUDENT</option>
            <option value="LECTURER">LECTURER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <button className="btn">Create</button>
        </div>
      </form>

      {/* Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-line">
              <th className="py-2 pr-3">ID</th>
              <th className="py-2 pr-3">Email</th>
              <th className="py-2 pr-3">Role</th>
              <th className="py-2 pr-3">Created</th>
              <th className="py-2 pr-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map(u=>(
              <tr key={u.id} className="border-b border-line/60">
                <td className="py-2 pr-3">{u.id}</td>
                <td className="py-2 pr-3">{u.email}</td>
                <td className="py-2 pr-3">{u.role}</td>
                <td className="py-2 pr-3">{u.createdAt ? new Date(u.createdAt).toLocaleString() : '—'}</td>
                <td className="py-2 pr-3">
                  <button className="btn mr-2" onClick={()=>setEdit(u)}>Edit</button>
                  <button className="btn" onClick={()=>del(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length===0 && <tr><td className="py-4 text-muted" colSpan={5}>No users</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Edit */}
      {edit && (
        <form onSubmit={updateUser} className="card p-6 mt-6">
          <div className="text-lg font-semibold mb-3">Edit user #{edit.id}</div>
          <div className="grid md:grid-cols-4 gap-3">
            <input className="card px-4 py-3" placeholder="Email" value={edit.email} onChange={e=>setEdit(s=>s?{...s, email:e.target.value}:s)}/>
            <select className="card px-3 py-3" value={edit.role} onChange={e=>setEdit(s=>s?{...s, role: e.target.value as Role}:s)}>
              <option value="STUDENT">STUDENT</option>
              <option value="LECTURER">LECTURER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <input className="card px-4 py-3" type="password" placeholder="(Optional) New password" value={pwd} onChange={e=>setPwd(e.target.value)}/>
            <button className="btn">Update</button>
          </div>
        </form>
      )}
    </main>
  )
}
