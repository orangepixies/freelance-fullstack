'use client'
import { useEffect, useRef, useState, useTransition } from 'react'
import { useLang } from '@/components/i18n/LanguageProvider'
import NewsCard from './NewsCard'
import Reveal from './Reveal'

type Article = { title:string; description?:string; url:string; imageUrl?:string|null; source?:string; publishedAt?:string }

const TABS = [
  { label: 'World', value: 'general' },
  { label: 'Business', value: 'business' },
  { label: 'Technology', value: 'technology' },
  { label: 'Sports', value: 'sports' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Health', value: 'health' },
  { label: 'Science', value: 'science' },
]

export default function CategoryTabs({ initialItems, initialValue = 'general' }:{
  initialItems: Article[]; initialValue?: string
}) {
  const { lang } = useLang()
  const [active, setActive] = useState<string>(initialValue)
  const [items, setItems] = useState<Article[]>(initialItems ?? [])
  const [isPending, startTransition] = useTransition()
  const first = useRef(true)

  useEffect(() => {
    // skip fetch pertama jika sudah punya SSR data utk tab awal
    if (first.current && active === initialValue && (items?.length ?? 0) > 0) {
      first.current = false
      return
    }
    first.current = false

    startTransition(async () => {
      const res = await fetch(`/api/news/by-category?category=${encodeURIComponent(active)}&lang=${lang.toLowerCase()}`)
      const json = await res.json()
      setItems(json.articles || [])
    })
  }, [active, lang])

  return (
    <section className="container mt-16">
      <div className="flex flex-wrap gap-2 justify-center">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setActive(t.value)}
            className={`px-4 py-2 rounded-full border transition ${
              active === t.value ? 'bg-accent text-black border-accent' : 'border-line text-zinc-200 hover:border-zinc-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Reveal>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {isPending && !items.length
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 rounded-2xl border border-line bg-card animate-pulse" />
              ))
            : items.map((a, i) => <NewsCard key={`${i}-${a.url}`} {...a} />)}
        </div>
        {!isPending && !items.length && (
          <div className="text-center text-sm text-muted mt-6">
            No articles right now. Please try again later.
          </div>
        )}
      </Reveal>
    </section>
  )
}
