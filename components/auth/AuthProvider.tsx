'use client'

import useSWR from 'swr'
import { createContext, useContext, useMemo, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

type User = { id?: number; email: string; role: string }

type Ctx = {
  user: User | null
  isLoading: boolean
  refresh: () => void
  logout: () => Promise<void>
}

const AuthCtx = createContext<Ctx | null>(null)

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then(async (r) => (r.ok ? r.json() : { ok: false }))

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, mutate } = useSWR('/api/auth/me', fetcher, {
    shouldRetryOnError: false,
  })
  const router = useRouter()

  const value = useMemo<Ctx>(() => ({
    user: data?.ok ? (data.user as User) : null,
    isLoading,
    refresh: () => mutate(),
    logout: async () => {
      await fetch('/api/auth/logout', { method: 'POST' })
      await mutate()
      router.push('/login')
    },
  }), [data, isLoading, mutate, router])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
