'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type Lang = 'en' | 'id'
type Ctx = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (en: string, id?: string) => string
}

const LangContext = createContext<Ctx | null>(null)

export default function LanguageProvider({
  initialLang,
  children,
}: { initialLang: Lang; children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang ?? 'en')
  const value = useMemo<Ctx>(() => ({
    lang,
    setLang,
    t: (en, id) => (lang === 'id' ? id ?? en : en),
  }), [lang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>')
  return ctx
}
