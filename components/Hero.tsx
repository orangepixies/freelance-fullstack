'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import { useLang } from '@/components/i18n/LanguageProvider'

export default function Hero() {
  const { lang } = useLang()
  const t = (en: string, id: string) => (lang === 'id' ? id : en)

  // Parallax + subtle blur on scroll
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 300], [0, -40])
  const scale = useTransform(scrollY, [0, 300], [1, 1.05])
  const blur = useTransform(scrollY, [0, 300], [0, 8])
  const blurFilter = useMotionTemplate`blur(${blur}px)`

  return (
    <section className="relative min-h-[80svh] grid place-items-center overflow-hidden">
      {/* Background image with parallax + blur */}
      <motion.div className="absolute inset-0" style={{ y, scale, filter: blurFilter }}>
        <Image
          src="https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=2000&q=80"
          alt="Global news background"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
      </motion.div>

      {/* Copy */}
      <div className="relative z-10 container text-center px-6">
        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
            {t('Global News & Insights', 'Berita & Wawasan Dunia')}
          </h1>
          <p className="text-lg md:text-xl text-zinc-300">
            {t(
              'Realtime headlines, curated for you — switch EN/ID anytime.',
              'Headline terkini, terkurasi untukmu — bebas ganti EN/ID.'
            )}
          </p>
          <div className="mt-6">
            <a href="#top-stories" className="btn"> {t('See Top Stories', 'Lihat Headline')} </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
