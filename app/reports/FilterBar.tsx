'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState, FormEvent } from 'react'

type Props = {
  programs: string[]
}

export default function FilterBar({ programs }: Props) {
  const router = useRouter()
  const sp = useSearchParams()

  const initial = useMemo(() => ({
    from: sp.get('from') ?? '',
    to: sp.get('to') ?? '',
    program: sp.get('program') ?? '',
  }), [sp])

  const [from, setFrom] = useState(initial.from)
  const [to, setTo] = useState(initial.to)
  const [program, setProgram] = useState(initial.program)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const q = new URLSearchParams()
    if (from) q.set('from', from)
    if (to) q.set('to', to)
    if (program) q.set('program', program)
    router.push(`/reports${q.toString() ? `?${q.toString()}` : ''}` as any)
  }

  function onReset() {
    setFrom('')
    setTo('')
    setProgram('')
    router.push('/reports')
  }

  return (
    <form onSubmit={onSubmit} className="card p-4 flex flex-wrap gap-3 items-end">
      <div>
        <label className="block text-xs text-muted mb-1">From</label>
        <input
          type="date"
          className="input"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-xs text-muted mb-1">To</label>
        <input
          type="date"
          className="input"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-xs text-muted mb-1">Program</label>
        <select
          className="input"
          value={program}
          onChange={(e) => setProgram(e.target.value)}
        >
          <option value="">All programs</option>
          {programs.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="ml-auto flex gap-2">
        <button type="button" onClick={onReset} className="btn">Reset</button>
        <button type="submit" className="btn btn-primary">Apply</button>
      </div>
    </form>
  )
}
