'use client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useLang } from '@/components/i18n/LanguageProvider'
import { useAuth } from '@/components/auth/AuthProvider'
import { getMenuForRole } from '@/lib/menus'
import { useEffect, useState } from 'react'

const AuthButton = dynamic(()=>import('@/components/AuthButton'), { ssr:false })

export default function Header(){
  const { lang, setLang } = useLang()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  // close mobile menu saat route berubah (kalau kamu pakai app router, ini cukup aman)
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [])

  const items = getMenuForRole(user?.role)
  const displayName = (user as any)?.name || (user?.email ? user.email.split('@')[0] : '')
  const role = user?.role || 'GUEST'

  async function handleSignOut() {
    await fetch('/api/auth/logout', { method: 'POST' })
    location.href = '/'
  }

  function RoleBadge() {
    const color =
      role === 'ADMIN' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
      role === 'LECTURER' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
      role === 'STUDENT' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
      'bg-zinc-700/40 text-zinc-300 border-zinc-500/30'
    return (
      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${color}`}>
        {role}
      </span>
    )
  }

  return (
    <motion.header
      initial={{opacity:0,y:-10}}
      animate={{opacity:1,y:0}}
      transition={{duration:.5}}
      className="sticky top-0 z-50 backdrop-blur border-b border-white/5 bg-black/60"
    >
      <div className="container py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          vodjo<span className="text-accent">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5">
          {items.map(item => (
            <Link
              key={item.key}
              href={item.href as any}
              className="text-sm text-zinc-200 link-underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* lang switch */}
          <div className="hidden sm:flex items-center gap-2 font-semibold text-sm text-zinc-300">
            <button onClick={()=>setLang('en')} className={lang==='en' ? 'text-white' : 'hover:text-accent'}>EN</button>
            <span className="text-zinc-600">/</span>
            <button onClick={()=>setLang('id')} className={lang==='id' ? 'text-white' : 'hover:text-accent'}>ID</button>
          </div>

          {/* user area (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm text-zinc-300 hidden sm:inline">{displayName}</span>
                <RoleBadge />
                <button
                  onClick={handleSignOut}
                  className="text-sm px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm px-3 py-1 rounded-md bg-accent/20 hover:bg-accent/30"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* hamburger (mobile) */}
          <button
            aria-label="Open menu"
            className="md:hidden w-9 h-9 rounded-md grid place-items-center bg-white/5 hover:bg-white/10"
            onClick={() => setOpen(true)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/60"
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            onClick={() => setOpen(false)}
          >
            <motion.aside
              className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-zinc-950 border-l border-white/10 p-5 flex flex-col"
              initial={{x: 320}}
              animate={{x: 0}}
              exit={{x: 320}}
              transition={{type:'spring', damping:20, stiffness:200}}
              onClick={(e)=>e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{displayName || 'Guest'}</div>
                  <RoleBadge />
                </div>
                <button
                  aria-label="Close menu"
                  className="w-9 h-9 grid place-items-center rounded-md hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor"/>
                  </svg>
                </button>
              </div>

              {/* language switch (mobile) */}
              <div className="flex items-center gap-2 font-semibold text-sm text-zinc-300 mb-4">
                <button onClick={()=>setLang('en')} className={lang==='en' ? 'text-white' : 'hover:text-accent'}>EN</button>
                <span className="text-zinc-600">/</span>
                <button onClick={()=>setLang('id')} className={lang==='id' ? 'text-white' : 'hover:text-accent'}>ID</button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <ul className="space-y-2">
                  {items.map(item => (
                    <li key={item.key}>
                      <Link
                        href={item.href as any}
                        onClick={()=>setOpen(false)}
                        className="block px-3 py-2 rounded-md hover:bg-white/5 text-zinc-200"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 border-t border-white/10 pt-4 flex items-center justify-between">
                {user ? (
                  <>
                    <button
                      onClick={async ()=>{
                        await handleSignOut()
                      }}
                      className="px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm"
                    >
                      Sign out
                    </button>
                    <Link
                      href="/dashboard"
                      onClick={()=>setOpen(false)}
                      className="px-3 py-2 rounded-md bg-accent/20 hover:bg-accent/30 text-sm"
                    >
                      Dashboard
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={()=>setOpen(false)}
                    className="px-3 py-2 rounded-md bg-accent/20 hover:bg-accent/30 text-sm"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
