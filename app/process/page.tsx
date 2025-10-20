'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLang } from '@/components/i18n/LanguageProvider'

const fade = (d=0)=>({
  initial:{opacity:0,y:16},
  whileInView:{opacity:1,y:0},
  viewport:{once:true,amount:.25},
  transition:{duration:.5,delay:d}
})

export default function ProcessPage(){
  const { lang } = useLang()
  const t = (en:string, id:string)=> lang==='id' ? id : en

  const phases = [
    {
      num: 1,
      title: t('Brief & Scope','Brief & Ruang Lingkup'),
      goal: t('Align on goals, audience, and success metrics.',
              'Selaraskan tujuan, audiens, dan metrik sukses.'),
      duration: t('1–2 days','1–2 hari'),
      outputs: [
        t('Problem statement & objectives','Pernyataan masalah & objektif'),
        t('High-level scope & risks','Scope tingkat tinggi & risiko'),
        t('Milestone plan','Rencana milestone'),
      ]
    },
    {
      num: 2,
      title: t('Architecture & Design System','Arsitektur & Design System'),
      goal: t('Decide IA, routes, content models, and UI tokens.',
              'Tentukan IA, rute, model konten, dan token UI.'),
      duration: t('2–4 days','2–4 hari'),
      outputs: [
        t('Information architecture','Information architecture'),
        t('Content schema (CMS/Notion)','Skema konten (CMS/Notion)'),
        t('Design tokens & components','Token desain & komponen'),
      ]
    },
    {
      num: 3,
      title: t('Build in Slices','Bangun Bertahap'),
      goal: t('Ship vertical slices: homepage → categories → article → admin.',
              'Rilis slice vertikal: homepage → kategori → artikel → admin.'),
      duration: t('2–6 weeks','2–6 minggu'),
      outputs: [
        t('Incremental releases','Rilis bertahap'),
        t('Perf/SEO checks per slice','Cek performa/SEO per slice'),
        t('A/B hooks where needed','Hook A/B bila perlu'),
      ]
    },
    {
      num: 4,
      title: t('QA, Launch & Handover','QA, Rilis & Serah Terima'),
      goal: t('Polish, monitor, and document the system.',
              'Poles, monitor, dan dokumentasikan sistem.'),
      duration: t('3–7 days','3–7 hari'),
      outputs: [
        t('Checklists & load test','Checklist & uji beban'),
        t('Observability & alerts','Observability & alert'),
        t('Runbook & docs','Runbook & dokumentasi'),
      ]
    },
    {
      num: 5,
      title: t('Measure & Iterate','Ukur & Iterasi'),
      goal: t('Review metrics, backlog, and next bets.',
              'Review metrik, backlog, dan prioritas berikutnya.'),
      duration: t('ongoing','berkelanjutan'),
      outputs: [
        t('KPI dashboard','Dasbor KPI'),
        t('Backlog grooming','Perapihan backlog'),
        t('Monthly improvements','Peningkatan bulanan'),
      ]
    },
  ]

  const comms = [
    t('Weekly demo & checkpoint','Demo mingguan & checkpoint'),
    t('Shared board (Notion/Jira)','Papan bersama (Notion/Jira)'),
    t('Chat ops (Slack/Telegram)','Chat ops (Slack/Telegram)'),
    t('Staging preview links','Tautan preview staging'),
  ]

  const models = [
    {
      badge:'Fixed',
      name:t('Fixed Scope','Scope Tetap'),
      desc:t('Clear scope, timeline, and price for well-defined projects.',
              'Scope, timeline, dan harga jelas untuk proyek terdefinisi.'),
    },
    {
      badge:'Sprint',
      name:t('Iterative Sprints','Sprint Iteratif'),
      desc:t('Two-week sprints with prioritized backlog and demos.',
              'Sprint dua minggu dengan backlog prioritas & demo.'),
    },
    {
      badge:'SLA',
      name:t('Support & SLA','Dukungan & SLA'),
      desc:t('Measured response times, patching, and small changes.',
              'Waktu respon terukur, patch, dan perubahan kecil.'),
    },
  ]

  return (
    <main className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[50svh] grid place-items-center">
        <motion.div className="absolute inset-0" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.6}}>
          <Image
            src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=2000&q=80"
            alt="Process background"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        </motion.div>
        <div className="relative z-10 container text-center px-6">
          <motion.h1 {...fade()} className="text-5xl md:text-6xl font-extrabold">
            {t('Process','Proses')}
          </motion.h1>
          <motion.p {...fade(.06)} className="text-zinc-300 mt-3 max-w-2xl mx-auto">
            {t(
              'Small iterations, measurable impact. Ship value early and often.',
              'Iterasi kecil, dampak terukur. Rilis nilai lebih awal dan sering.'
            )}
          </motion.p>
        </div>
      </section>

      {/* PHASES */}
      <section className="container mt-12">
        <motion.h2 {...fade()} className="text-2xl font-bold mb-4">
          {t('Phases','Fase')}
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-5">
          {phases.map((p, i)=>(
            <motion.div key={p.num} {...fade(i*0.05)} className="card p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-accent font-semibold flex items-center gap-2">
                    <span className="badge">{p.num}</span> {p.title}
                  </div>
                  <div className="text-zinc-300 mt-1">{p.goal}</div>
                </div>
                <div className="text-xs text-zinc-400">{t('Duration','Durasi')}: {p.duration}</div>
              </div>
              <ul className="mt-4 space-y-2 text-zinc-300">
                {p.outputs.map((o, k)=>(
                  <li key={k} className="flex items-center gap-2">
                    <span className="badge">•</span> {o}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* COMMUNICATION */}
      <section className="container mt-12">
        <motion.h2 {...fade()} className="text-2xl font-bold mb-4">
          {t('Communication & Workflow','Komunikasi & Alur Kerja')}
        </motion.h2>
        <motion.div {...fade(.04)} className="card p-6">
          <div className="grid md:grid-cols-2 gap-3 text-zinc-300">
            {comms.map((c, i)=>(
              <div key={i} className="flex items-center gap-2">
                <span className="badge">✓</span>{c}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ENGAGEMENT MODELS */}
      <section className="container mt-12">
        <motion.h2 {...fade()} className="text-2xl font-bold mb-4">
          {t('Engagement Models','Model Keterlibatan')}
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-5">
          {models.map((m, i)=>(
            <motion.div key={m.name} {...fade(i*0.05)} className="card p-6 hover:border-accent/40 transition">
              <div className="badge mb-2">{m.badge}</div>
              <div className="text-xl font-semibold">{m.name}</div>
              <p className="text-zinc-300 mt-2">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mt-12">
        <motion.h2 {...fade()} className="text-2xl font-bold mb-4">FAQ</motion.h2>
        <div className="grid md:grid-cols-2 gap-4">
          <motion.details {...fade()} className="card p-5">
            <summary className="cursor-pointer font-semibold">
              {t('Can we overlap phases?','Apakah fase bisa tumpang tindih?')}
            </summary>
            <p className="text-zinc-300 mt-2">
              {t('Yes—design system and first slice often start in parallel to ship earlier.',
                 'Bisa—design system dan slice pertama sering jalan paralel agar rilis lebih cepat.')}
            </p>
          </motion.details>
          <motion.details {...fade(.04)} className="card p-5">
            <summary className="cursor-pointer font-semibold">
              {t('How do we track progress?','Bagaimana melacak progres?')}
            </summary>
            <p className="text-zinc-300 mt-2">
              {t('Weekly demo, shared board, and preview links keep everyone aligned.',
                 'Demo mingguan, papan bersama, dan tautan preview menjaga sinkronisasi.')}
            </p>
          </motion.details>
        </div>
      </section>

      {/* CTA */}
      <section className="container mt-14 mb-24">
        <motion.div {...fade()} className="card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xl font-semibold">
              {t('Ready to kick off?','Siap memulai?')}
            </div>
            <div className="text-zinc-400">
              {t('Share your timeline and constraints—let’s shape a realistic plan.',
                 'Ceritakan timeline dan constraint—kita bentuk rencana yang realistis.')}
            </div>
          </div>
          <Link href="/#contact" className="btn">{t('Start a project','Mulai proyek')}</Link>
        </motion.div>
      </section>
    </main>
  )
}
