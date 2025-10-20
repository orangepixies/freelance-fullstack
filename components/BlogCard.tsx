'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function BlogCard({
  slug, title, excerpt, date, imageUrl, category, readingMinutes,
}: {
  slug: string; title: string; excerpt: string; date: string;
  imageUrl?: string; category?: string; readingMinutes: number;
}) {
  const FALLBACK = '/placeholder.jpg' // taruh gambar 1200x800 di /public/placeholder.jpg
  const d = new Date(date)

  return (
    <motion.article
      initial={{opacity:0, y:12}}
      whileInView={{opacity:1, y:0}}
      viewport={{once:true, amount:.3}}
      transition={{duration:.45}}
      className="group relative overflow-hidden rounded-2xl border border-line bg-card"
    >
      <Link href={`/blog/${slug}`} className="block">
        <div className="relative w-full h-52">
          <Image
            src={(imageUrl && imageUrl.length>6) ? imageUrl : FALLBACK}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 33vw"
            unoptimized
          />
          {/* overlay: default 0, on hover 70% */}
          <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-colors duration-300" />

          {/* text on hover (desktop), always visible on mobile */}
          <div className="absolute inset-0 flex items-end p-4 md:p-5">
            <div className="w-full">
              <div className="flex items-center justify-between text-xs text-zinc-300 mb-1">
                <span className="uppercase tracking-wide">{category || 'General'}</span>
                <span>{d.toLocaleDateString()}</span>
              </div>
              <h3 className="text-white font-semibold leading-tight line-clamp-2
                             md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0
                             transition-all duration-300">
                {title}
              </h3>
              <p className="text-sm text-zinc-300/90 mt-1 line-clamp-2
                            hidden md:block md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0
                            transition-all duration-300">
                {excerpt}
              </p>
              <div className="mt-2 text-xs text-zinc-400">
                {readingMinutes} min read
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
