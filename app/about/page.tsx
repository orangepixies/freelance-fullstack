'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useLang } from '@/components/i18n/LanguageProvider'
import Link from 'next/link'

const fade = (d=0)=>({ initial:{opacity:0,y:16}, whileInView:{opacity:1,y:0}, viewport:{once:true,amount:.3}, transition:{duration:.55, delay:d} })

export default function AboutPage(){
  const { lang } = useLang()
  const t = (en:string, id:string)=> lang==='id' ? id : en

  const highlights = [
    { k: t('Full-Stack', 'Full-Stack'), v: t('From idea → deploy', 'Dari ide → rilis') },
    { k: t('Performance', 'Performa'), v: t('Fast, reliable UX', 'Cepat & andal') },
    { k: t('Delivery', 'Delivery'), v: t('Ship in slices', 'Rilis bertahap') },
  ]

  const timeline = [
    { y: '2025', en: 'Launched news-oriented platform template', id: 'Rilis template platform berita' },
    { y: '2024', en: 'Built SaaS MVPs for SMEs', id: 'Bangun MVP SaaS untuk UKM' },
    { y: '2023', en: 'Freelance full-time (web/mobile)', id: 'Freelance full-time (web/mobile)' },
  ]

  return (
    <main className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[60svh] grid place-items-center">
        <motion.div className="absolute inset-0" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.6}}>
          <Image
            src="https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=2000&q=80"
            alt="About background"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        </motion.div>

        <div className="relative z-10 container text-center px-6">
          <motion.h1 {...fade()} className="text-5xl md:text-6xl font-extrabold">
            {t('About', 'Tentang')}
          </motion.h1>
          <motion.p {...fade(.08)} className="text-zinc-300 mt-3 max-w-2xl mx-auto">
            {t(
              'I’m a freelance full-stack developer crafting content-driven products—news, dashboards, and apps—with pragmatic engineering.',
              'Saya freelance full-stack yang membangun produk berbasis konten—portal berita, dashboard, dan aplikasi—dengan pendekatan pragmatis.'
            )}
          </motion.p>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="container mt-12">
        <motion.h2 {...fade()} className="text-2xl font-bold mb-4">
          {t('What I Focus On','Fokus Utama')}
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-4">
          {highlights.map((h, i)=>(
            <motion.div key={i} {...fade(i*0.06)} className="card p-6">
              <div className="text-accent font-semibold">{h.k}</div>
              <div className="text-zinc-300 mt-1">{h.v}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BIO / APPROACH */}
      <section className="container mt-12 grid md:grid-cols-2 gap-8">
        <motion.div {...fade()}>
          <h3 className="text-xl font-semibold mb-2">{t('Approach','Pendekatan')}</h3>
          <p className="text-zinc-300">
            {t(
              'Small iterations, measurable impact. I pick the right tool per job—Next.js for the web, queues for reliability, caching for speed.',
              'Iterasi kecil, dampak terukur. Saya pilih tool sesuai kebutuhan—Next.js untuk web, antrian untuk reliabilitas, caching untuk kecepatan.'
            )}
          </p>
          <ul className="text-zinc-300 mt-3 list-disc pl-5 space-y-1">
            <li>{t('Content-first architecture for SEO & distribution.', 'Arsitektur content-first untuk SEO & distribusi.')}</li>
            <li>{t('Strong DX → faster shipping (types, lint, CI).', 'DX kuat → rilis cepat (types, lint, CI).')}</li>
            <li>{t('Observability to catch issues early.', 'Observability untuk deteksi dini masalah.')}</li>
          </ul>
        </motion.div>

        <motion.div {...fade(.06)}>
          <h3 className="text-xl font-semibold mb-2">{t('Toolbox','Toolbox')}</h3>
          <div className="grid grid-cols-2 gap-3 text-zinc-300">
            {[
              'Next.js','React','TypeScript','Tailwind','Framer Motion','Node.js',
              'Postgres','Redis','Prisma','Notion','Telegram Bot','Vercel'
            ].map((s,i)=>(
              <div key={i} className="card px-4 py-3">{s}</div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* TIMELINE */}
      <section className="container mt-12">
        <motion.h3 {...fade()} className="text-xl font-semibold mb-4">
          {t('Timeline','Linimasa')}
        </motion.h3>
        <div className="space-y-4">
          {timeline.map((tln, i)=>(
            <motion.div key={i} {...fade(i*0.05)} className="card p-5 flex items-start gap-4">
              <div className="badge">{tln.y}</div>
              <div className="text-zinc-200">{lang==='id' ? tln.id : tln.en}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mt-14 mb-20">
        <motion.div {...fade()} className="card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xl font-semibold">
              {t('Have a project in mind?','Ada proyek yang ingin dibangun?')}
            </div>
            <div className="text-zinc-400">
              {t('Let’s translate it into a shippable roadmap.','Ayo terjemahkan jadi roadmap yang siap rilis.')}
            </div>
          </div>
          <Link href="/#contact" className="btn">
            {t('Get in touch','Hubungi saya')}
          </Link>
        </motion.div>
      </section>
    </main>
  )
}
