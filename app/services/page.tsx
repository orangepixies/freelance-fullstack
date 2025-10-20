'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLang } from '@/components/i18n/LanguageProvider'

const fade = (d=0)=>({
  initial:{opacity:0,y:16},
  whileInView:{opacity:1,y:0},
  viewport:{once:true,amount:.25},
  transition:{duration:.5, delay:d}
})

export default function ServicesPage(){
  const { lang } = useLang()
  const t = (en:string,id:string)=> lang==='id'? id : en

  const services = [
    {
      title: t('News Platform', 'Platform Berita'),
      desc: t('End-to-end news site with sections, categories, search, and editorial tooling.',
               'Website berita end-to-end dengan section, kategori, pencarian, dan tooling editorial.'),
      points: [t('SEO-ready structure','Struktur siap SEO'), t('Caching & speed','Caching & kecepatan'), t('Analytics','Analitik')]
    },
    {
      title: t('Headless CMS','Headless CMS'),
      desc: t('CMS you control (Notion/Strapi/Sanity) wired to your frontend.',
               'CMS fleksibel (Notion/Strapi/Sanity) terhubung ke frontend kamu.'),
      points: [t('Draft/Publish flow','Alur Draft/Publish'), t('Roles & permissions','Role & izin'), t('Live preview','Pratinjau langsung')]
    },
    {
      title: t('API & Integrations','API & Integrasi'),
      desc: t('Bring in feeds (RSS/NewsAPI), Telegram bots, email, webhooks.',
               'Integrasi feed (RSS/NewsAPI), bot Telegram, email, webhook.'),
      points: [t('Rate-limit & retry','Rate-limit & retry'), t('Error tracking','Pelacakan error'), t('Queue workers','Worker antrian')]
    },
    {
      title: t('Performance & SEO','Performa & SEO'),
      desc: t('Core Web Vitals, image strategy, structured data, sitemap.',
               'Core Web Vitals, strategi gambar, structured data, sitemap.'),
      points: [t('CLS/LCP audits','Audit CLS/LCP'), t('Lazy & prefetch','Lazy & prefetch'), t('Schema.org','Schema.org')]
    },
    {
      title: t('Analytics & A/B','Analitik & A/B'),
      desc: t('Mark what matters; test headlines and layouts safely.',
               'Pantau metrik penting; uji headline & layout dengan aman.'),
      points: [t('Event map','Pemetaan event'), t('A/B infra','Infrastruktur A/B'), t('Reporting','Pelaporan')]
    },
    {
      title: t('DevOps & Deploy','DevOps & Deploy'),
      desc: t('CI/CD, staging, observability, alerts. Ship confidently.',
               'CI/CD, staging, observability, alert. Rilis dengan yakin.'),
      points: [t('CI pipelines','Pipeline CI'), t('Monitoring','Monitoring'), t('Backups','Cadangan')]
    },
  ]

  const plans = [
    {
      name: t('Starter','Starter'),
      price: t('from $999','mulai 15 jt'),
      best: false,
      features: [
        t('Landing + 1 category','Landing + 1 kategori'),
        t('Basic CMS','CMS dasar'),
        t('Email/Telegram contact','Kontak Email/Telegram')
      ]
    },
    {
      name: t('Pro','Pro'),
      price: t('from $2,900','mulai 45 jt'),
      best: true,
      features: [
        t('Multi-category news','Berita multi-kategori'),
        t('Caching & SEO setup','Caching & setup SEO'),
        t('Analytics + A/B infra','Analitik + A/B')
      ]
    },
    {
      name: t('Custom','Kustom'),
      price: t('ask','tanya'),
      best: false,
      features: [
        t('Custom workflow','Alur kerja kustom'),
        t('Headless CMS of choice','Headless CMS pilihan'),
        t('Integrations & automations','Integrasi & otomasi')
      ]
    }
  ]

  const steps = [
    t('Brief & scope','Brief & ruang lingkup'),
    t('Design system & IA','Design system & IA'),
    t('Build in slices','Bangun bertahap'),
    t('QA + launch','QA + rilis'),
    t('Measure & iterate','Ukur & iterasi')
  ]

  return (
    <main className="overflow-hidden">
      {/* HERO */}
      <section className="container text-center py-14">
        <motion.h1 {...fade()} className="text-5xl md:text-6xl font-extrabold">
          {t('Services','Layanan')}
        </motion.h1>
        <motion.p {...fade(.06)} className="text-zinc-300 mt-3 max-w-2xl mx-auto">
          {t(
            'Everything you need to launch and grow a modern, content-driven news site.',
            'Semua yang dibutuhkan untuk meluncurkan & mengembangkan situs berita modern.'
          )}
        </motion.p>
      </section>

      {/* GRID SERVICES */}
      <section className="container">
        <div className="grid md:grid-cols-3 gap-5">
          {services.map((s, i)=>(
            <motion.div key={i} {...fade(i*0.05)} className="card p-6 hover:border-accent/40 transition">
              <div className="text-accent font-semibold">{s.title}</div>
              <p className="text-zinc-300 mt-2">{s.desc}</p>
              <ul className="text-zinc-300 mt-3 space-y-1">
                {s.points.map((p,j)=> <li key={j} className="flex items-center gap-2"><span className="badge">✓</span>{p}</li>)}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PLANS */}
      <section className="container mt-14">
        <motion.h2 {...fade()} className="text-2xl font-bold mb-4">
          {t('Packages','Paket')}
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((p,i)=>(
            <motion.div key={i} {...fade(i*0.05)}
              className={`card p-6 ${p.best ? 'border-accent shadow-glow' : ''}`}>
              {p.best && <div className="badge mb-3">{t('Most popular','Paling populer')}</div>}
              <div className="text-xl font-semibold">{p.name}</div>
              <div className="text-3xl font-extrabold mt-1">{p.price}</div>
              <ul className="text-zinc-300 mt-4 space-y-2">
                {p.features.map((f,j)=> <li key={j} className="flex items-center gap-2"><span className="badge">•</span>{f}</li>)}
              </ul>
              <div className="mt-6">
                <Link href="/#contact" className="btn">{t('Get quote','Minta penawaran')}</Link>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-zinc-500 mt-3">
          {t('Prices are indicative and depend on scope, integrations, and timeline.',
             'Harga indikatif, tergantung scope, integrasi, dan timeline.')}
        </p>
      </section>

      {/* PROCESS SNAPSHOT */}
      <section className="container mt-14">
        <motion.h2 {...fade()} className="text-2xl font-bold mb-4">{t('Process Overview','Ringkasan Proses')}</motion.h2>
        <div className="grid md:grid-cols-5 gap-3">
          {steps.map((s,i)=>(
            <motion.div key={i} {...fade(i*0.04)} className="card p-4 text-sm text-zinc-300">
              <div className="badge mb-2">{i+1}</div>
              {s}
            </motion.div>
          ))}
        </div>
        <div className="mt-4">
          <Link href="/process" className="link-underline text-sm">{t('See full process →','Lihat proses lengkap →')}</Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mt-14">
        <motion.h2 {...fade()} className="text-2xl font-bold mb-4">FAQ</motion.h2>
        <div className="grid md:grid-cols-2 gap-4">
          <motion.details {...fade()} className="card p-5">
            <summary className="cursor-pointer font-semibold">
              {t('How long does a project take?','Berapa lama durasi proyek?')}
            </summary>
            <p className="text-zinc-300 mt-2">
              {t('Starter ~2–3 weeks. Pro ~4–8 weeks, depending on content, categories, and integrations.',
                 'Starter ~2–3 minggu. Pro ~4–8 minggu, tergantung konten, kategori, dan integrasi.')}
            </p>
          </motion.details>
          <motion.details {...fade(.04)} className="card p-5">
            <summary className="cursor-pointer font-semibold">
              {t('Do you migrate existing content?','Apakah bisa migrasi konten lama?')}
            </summary>
            <p className="text-zinc-300 mt-2">
              {t('Yes—via RSS/CSV or APIs where available, with redirects for SEO.',
                 'Bisa—via RSS/CSV atau API jika tersedia, plus redirect untuk SEO.')}
            </p>
          </motion.details>
        </div>
      </section>

      {/* CTA */}
      <section className="container mt-16 mb-24">
        <motion.div {...fade()} className="card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xl font-semibold">
              {t('Ready to build your news platform?','Siap bangun platform beritamu?')}
            </div>
            <div className="text-zinc-400">
              {t('Tell me your goals and constraints—let’s shape a plan.',
                 'Ceritakan target dan batasannya—kita bentuk rencananya.')}
            </div>
          </div>
          <Link href="/#contact" className="btn">{t('Start a project','Mulai proyek')}</Link>
        </motion.div>
      </section>
    </main>
  )
}
