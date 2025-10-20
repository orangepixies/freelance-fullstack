'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AuthButton(){
  const [user, setUser] = useState<{email:string; role:string} | null>(null)

  useEffect(()=>{
    (async()=>{
      try {
        const r = await fetch('/api/auth/me', { cache: 'no-store' })
        if (r.ok) {
          const j = await r.json()
          if (j.ok) setUser(j.user)
        }
      } catch {}
    })()
  },[])

  async function logout(){
    await fetch('/api/auth/logout', { method:'POST' })
    window.location.href = '/'
  }

  if (!user) {
    return <Link href="/login" className="btn">Sign in</Link>
  }
  return (
    <div className="flex items-center gap-2">
      <Link href="/dashboard" className="btn">Dashboard</Link>
      <button onClick={logout} className="btn">Sign out</button>
    </div>
  )
}
