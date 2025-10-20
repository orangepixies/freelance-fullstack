'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/components/i18n/LanguageProvider'

type Work = {
  title: string
  summary: string
  image: string
  href: string
  category: 'News' | 'Web App' | 'Dashboard' | 'Integration'
  year: string
  tags: string[]
}

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.5, delay: d },
})

const DATA: Work[] = [
  {
    title: 'Atlas Daily',
    summary: 'A blazing-fast news portal with multi-category editorial workflow.',
    image:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80',
    href: 'https://example.com/case/atlas-daily',
    category: 'News',
    year: '2025',
    tags: ['Next.js', 'RSS', 'Caching'],
  },
  {
    title: 'CityPulse',
    summary: 'Realtime city dashboard: incidents, traffic, and anomalies.',
    image:
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1400&q=80',
    href: 'https://example.com/case/citypulse',
    category: 'Dashboard',
    year: '2024',
    tags: ['WebSocket', 'Maps', 'Analytics'],
  },
  {
    title: 'Market Brief',
    summary: 'Editorial CMS for business headlines, A/B tests on hero slots.',
    image:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80',
    href: 'https://example.com/case/market-brief',
    category: 'News',
    year: '2024',
    tags: ['Headless CMS', 'A/B', 'SEO'],
  },
  {
    title: 'Creator Hub',
    summary: 'Content studio for creators with scheduling and cross-posting.',
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1400&q=80',
    href: 'https://example.com/case/creator-hub',
    category: 'Web App',
    year: '2023',
    tags: ['Scheduler', 'Queue', 'Notion'],
  },
  {
    title: 'Wire Integrations',
    summary: 'Payment + email + Telegram bot integrations stitched together.',
    image:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80',
    href: 'https://example.com/case/wire-integrations',
    category: 'Integration',
    year: '2023',
    tags: ['Stripe', 'SMTP', 'Telegram'],
  },
  {
    title: 'Insight Board',
    summary: 'Executives dashboard with KPI snapshots and drill-downs.',
    image:
      'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=1400&q=80',
    href: 'https://example.com/case/insight-board',
    category: 'Dashboard',
    year: '2025',
    tags: ['Charts', 'SSR', 'Perf'],
  },
]

export default function WorksPage() {
  const { lang } = useLang()
  const t = (en: string, id: string) => (lang === 'id' ? id : en)

  const CATS = useMemo(
    () => [
      { key: 'all', label: t('All', 'Semua') },
      { key: 'News', label: t('News', 'Berita') },
      { key: 'Web App', label: t('Web App', 'Aplikasi Web') },
      { key: 'Dashboard', label: t('Dashboard', 'Dasbor') },
      { key: 'Integration', label: t('Integration', 'Integrasi') },
    ],
    [lang]
  )

  const [cat, setCat] = useState<string>('all')
  const [q, setQ] = useState('')

  const items = useMemo(() => {
    const byCat = cat === 'all' ? DATA : DATA.filter((d) => d.category === cat)
    const needle = q.trim().toLowerCase()
    if (!needle) return byCat
    return byCat.filter(
      (d) =>
        d.title.toLowerCase().includes(needle) ||
        d.summary.toLowerCase().includes(needle) ||
        d.tags.join(' ').toLowerCase().includes(needle)
    )
  }, [cat, q])

  return (
    <main className="overflow-hidden">
      {/* HERO */}
      <section className="container text-center py-14">
        <motion.h1 {...fade()} className="text-5xl md:text-6xl font-extrabold">
          {t('Works', 'Karya')}
        </motion.h1>
        <motion.p {...fade(0.06)} className="text-zinc-300 mt-3 max-w-2xl mx-auto">
          {t(
            'Selected projects across news, dashboards, and integrations.',
            'Proyek terpilih: portal berita, dasbor, dan integrasi.'
          )}
        </motion.p>
      </section>

      {/* CONTROLS */}
      <section className="container">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {CATS.map((c) => (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                className={`px-4 py-2 rounded-full border transition whitespace-nowrap ${
                  cat === c.key
                    ? 'bg-accent text-black border-accent'
                    : 'border-line text-zinc-200 hover:border-zinc-400'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="md:ml-auto w-full md:w-80">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('Search works…', 'Cari karya…')}
              className="w-full card px-4 py-3"
            />
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="container mt-8 mb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {items.length === 0 && (
            <div className="col-span-3 text-center text-muted">
              {t('No projects found.', 'Tidak ada proyek yang cocok.')}
            </div>
          )}

          {items.map((w, i) => (
            <motion.article
              key={w.title + i}
              {...fade(i * 0.04)}
              className="group relative overflow-hidden rounded-2xl border border-line bg-card"
            >
              <div className="relative w-full h-64">
                <Image
                  src={w.image}
                  alt={w.title}
                  fill
                  className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 33vw"
                  unoptimized
                />
                <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/70" />
                <div className="absolute inset-0 flex items-end p-5">
                  <div className="w-full">
                    {/* meta on hover */}
                    <div className="flex items-center justify-between text-xs text-zinc-300 mb-2
                                    md:opacity-0 md:translate-y-1 md:transition-all md:duration-300
                                    md:group-hover:opacity-100 md:group-hover:translate-y-0">
                      <span className="uppercase tracking-wide">{w.category}</span>
                      <span>{w.year}</span>
                    </div>
                    {/* title */}
                    <h3 className="text-white font-bold text-xl leading-tight line-clamp-2
                                   md:opacity-0 md:translate-y-1 md:transition-all md:duration-300
                                   md:group-hover:opacity-100 md:group-hover:translate-y-0">
                      {w.title}
                    </h3>
                    {/* summary on hover */}
                    <p className="text-sm text-zinc-300/90 mt-1 line-clamp-2
                                  md:opacity-0 md:translate-y-1 md:transition-all md:duration-300
                                  md:group-hover:opacity-100 md:group-hover:translate-y-0">
                      {w.summary}
                    </p>

                    {/* tags */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {w.tags.map((t, idx) => (
                        <span key={idx} className="badge">{t}</span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-4">
                      <Link
                        href={w.href as any}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn"
                      >
                        {t('View project', 'Lihat proyek')}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  )
}
