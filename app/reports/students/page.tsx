'use client'

import { useEffect, useState } from 'react'

type Student = { id:number; nim:string; name:string; program:string }

export default function StudentsReportPage(){
  const [items, setItems] = useState<Student[]>([])
  const [q, setQ] = useState('')

  async function load() {
    const r = await fetch('/api/students?q=' + encodeURIComponent(q))
    const j = await r.json()
    if (j.ok) setItems(j.items)
  }
  useEffect(()=>{ load() }, [q])

  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold">Report: Students</h1>

      <div className="mt-4 flex gap-2 items-center no-print">
        <input className="card px-4 py-3 w-80" placeholder="Filter (name/nim/program)…" value={q} onChange={e=>setQ(e.target.value)}/>
        <button className="btn" onClick={()=>window.print()}>Print</button>
      </div>

      

      <div className="mt-4 overflow-x-auto print:overflow-visible">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-line">
              <th className="py-2 pr-3">#</th>
              <th className="py-2 pr-3">NIM</th>
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3">Program</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s, i)=>(
              <tr key={s.id} className="border-b border-line/60">
                <td className="py-2 pr-3">{i+1}</td>
                <td className="py-2 pr-3">{s.nim}</td>
                <td className="py-2 pr-3">{s.name}</td>
                <td className="py-2 pr-3">{s.program}</td>
              </tr>
            ))}
            {items.length===0 && <tr><td className="py-4 text-muted" colSpan={4}>No data</td></tr>}
          </tbody>
        </table>
      </div>
    </main>
  )
}
