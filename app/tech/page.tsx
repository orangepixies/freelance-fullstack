'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/components/i18n/LanguageProvider'
import Link from 'next/link'

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.5, delay: d },
})

type Item = {
  name: string
  level: number   // 0..100
  since?: string
  notes?: string
  tags?: string[]
}

export default function TechPage() {
  const { lang } = useLang()
  const t = (en: string, id: string) => (lang === 'id' ? id : en)

  // KATEGORI TAB
  const TABS = useMemo(
    () => ([
      { key: 'fe', label: t('Frontend', 'Frontend') },
      { key: 'be', label: t('Backend', 'Backend') },
      { key: 'infra', label: t('Data & Infra', 'Data & Infra') },
      { key: 'tool', label: t('Tooling', 'Tooling') },
    ] as const),
    [lang]
  )
  type TabKey = typeof TABS[number]['key']

  const [active, setActive] = useState<TabKey>('fe')
  const [q, setQ] = useState('')

  // DATA TEKNO – konsisten dengan tema news platform
  const DATA: Record<TabKey, Item[]> = {
    fe: [
      { name: 'Next.js (App Router)', level: 92, since: '2020', tags: ['SSR/SSG', 'RSC'], notes: t('Routing, data fetching, image, SEO', 'Routing, data fetching, image, SEO') },
      { name: 'React 18', level: 92, since: '2017', tags: ['Hooks', 'Suspense'], notes: t('Islands, client/server orchestration', 'Islands, orkestrasi client/server') },
      { name: 'TypeScript', level: 90, since: '2019', tags: ['Types'], notes: t('Strict types for stability', 'Type ketat untuk stabilitas') },
      { name: 'Tailwind CSS', level: 88, since: '2020', tags: ['Utility'], notes: t('Design system cepat & konsisten', 'Design system cepat & konsisten') },
      { name: 'Framer Motion', level: 86, since: '2021', tags: ['UX'], notes: t('Micro-interaction & scroll reveal', 'Micro-interaction & scroll reveal') },
    ],
    be: [
      { name: 'Node.js', level: 88, since: '2016', tags: ['API'], notes: t('REST, webhooks, queues', 'REST, webhook, antrian') },
      { name: 'PostgreSQL', level: 84, since: '2018', tags: ['SQL'], notes: t('Relational schema & indexing', 'Skema relasional & indexing') },
      { name: 'Prisma', level: 82, since: '2020', tags: ['ORM'], notes: t('Schema-first, migrations', 'Schema-first, migrasi') },
      { name: 'Redis', level: 78, since: '2021', tags: ['Cache'], notes: t('Rate limit, caching, queues', 'Rate limit, cache, antrian') },
      { name: 'Auth (JWT/Cookies)', level: 80, since: '2019', tags: ['Security'], notes: t('HttpOnly+SameSite, session', 'HttpOnly+SameSite, sesi') },
    ],
    infra: [
      { name: 'Vercel', level: 86, since: '2020', tags: ['Deploy'], notes: t('Edge+Node runtime, ISR', 'Edge+Node runtime, ISR') },
      { name: 'CI/CD', level: 82, since: '2019', tags: ['GitHub Actions'], notes: t('Lint, test, preview', 'Lint, test, preview') },
      { name: 'Observability', level: 76, since: '2021', tags: ['Logs', 'Metrics'], notes: t('Sentry/Log drains', 'Sentry/Log drain') },
      { name: 'Images & CDN', level: 78, since: '2020', tags: ['Perf'], notes: t('Optimization & caching', 'Optimasi & cache') },
    ],
    tool: [
      { name: 'Notion API', level: 80, since: '2022', tags: ['CMS'], notes: t('Editorial workflow', 'Alur editorial') },
      { name: 'Telegram Bot API', level: 78, since: '2022', tags: ['Ops'], notes: t('Alerts & inbox ops', 'Alert & inbox ops') },
      { name: 'NewsAPI/RSS', level: 82, since: '2023', tags: ['Ingest'], notes: t('Crawl & curate news', 'Ambil & kurasi berita') },
      { name: 'Nodemailer (SMTP)', level: 78, since: '2019', tags: ['Email'], notes: t('Transactional emails', 'Email transaksional') },
    ],
  }

  const items = useMemo(() => {
    const list = DATA[active]
    const needle = q.trim().toLowerCase()
    if (!needle) return list
    return list.filter(i =>
      i.name.toLowerCase().includes(needle) ||
      (i.tags?.join(' ').toLowerCase() ?? '').includes(needle) ||
      (i.notes?.toLowerCase().includes(needle) ?? false)
    )
  }, [active, q])

  return (
    <main className="overflow-hidden">
      {/* HERO */}
      <section className="container text-center py-14">
        <motion.h1 {...fade()} className="text-5xl md:text-6xl font-extrabold">
          {t('Tech Stack', 'Tumpukan Teknologi')}
        </motion.h1>
        <motion.p {...fade(.06)} className="text-zinc-300 mt-3 max-w-2xl mx-auto">
          {t(
            'A pragmatic stack tuned for content-driven, high-performance news platforms.',
            'Stack pragmatis untuk platform berita berkinerja tinggi berbasis konten.'
          )}
        </motion.p>
      </section>

      {/* CONTROLS */}
      <section className="container">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`px-4 py-2 rounded-full border transition whitespace-nowrap ${
                  active === tab.key
                    ? 'bg-accent text-black border-accent'
                    : 'border-line text-zinc-200 hover:border-zinc-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="md:ml-auto w-full md:w-80">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('Search tech…', 'Cari teknologi…')}
              className="w-full card px-4 py-3"
            />
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="container mt-8">
        <div className="grid md:grid-cols-2 gap-5">
          {items.map((it, i) => (
            <motion.div key={it.name} {...fade(i*0.04)} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold">{it.name}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    {it.since ? t(`Since ${it.since}`, `Sejak ${it.since}`) : ''}
                  </div>
                </div>
                <span className="badge">{it.level}%</span>
              </div>

              {it.tags && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {it.tags.map((tg, k) => <span key={k} className="badge">{tg}</span>)}
                </div>
              )}

              {it.notes && <p className="text-zinc-300 mt-3">{it.notes}</p>}

              {/* Skill bar */}
              <div className="mt-4">
                <div className="h-2 w-full bg-line rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-accent rounded-full"
                    style={{ width: `${it.level}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mt-14 mb-24">
        <motion.div {...fade()} className="card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xl font-semibold">
              {t('Need a stack recommendation for your newsroom?', 'Butuh rekomendasi stack untuk redaksi kamu?')}
            </div>
            <div className="text-zinc-400">
              {t('Tell me your constraints—budget, team size, publishing workflow.',
                 'Ceritakan constraint-mu—budget, ukuran tim, alur publikasi.')}
            </div>
          </div>
          <Link href="/#contact" className="btn">{t('Get a free consult','Minta konsultasi')}</Link>
        </motion.div>
      </section>
    </main>
  )
}
