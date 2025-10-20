'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { refresh } = useAuth()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json?.ok) {
        setError(json?.error || 'Invalid email or password')
        return
      }
      await refresh()
      router.push('/dashboard')
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto card p-6 space-y-4">
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          className="input w-full"
          type="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Password</label>
        <input
          className="input w-full"
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button className="btn w-full" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
