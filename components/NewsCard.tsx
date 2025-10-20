'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cleanTitle, domainFrom, relativeTimeFrom } from '@/lib/format'

type Props = {
  title: string
  description?: string
  url: string
  imageUrl?: string | null
  source?: string
  publishedAt?: string
}

const FALLBACK_IMAGE = '/placeholder.jpg'

export default function NewsCard({ title, description, url, imageUrl, source, publishedAt }: Props) {
  const t = cleanTitle(title)
  const metaLeft = source || domainFrom(url)
  const metaRight = relativeTimeFrom(publishedAt)

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-line bg-card">
      <div className="relative w-full h-64 md:h-72">
        {/* Zoom image on hover */}
        <Image
          src={imageUrl || FALLBACK_IMAGE}
          alt={t}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
          unoptimized
        />

        {/* Black overlay to 70% on hover */}
        <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/70" />

        {/* Text layer */}
        <div className="absolute inset-0 flex items-end p-5">
          <div className="w-full">
            {/* Meta: hidden by default on desktop, show on hover; mobile selalu tampil kecil */}
            <div className="
              flex items-center justify-between text-xs text-zinc-300 mb-2
              md:opacity-0 md:translate-y-1 md:transition-all md:duration-300
              md:group-hover:opacity-100 md:group-hover:translate-y-0
            ">
              <span className="uppercase tracking-wide">{metaLeft}</span>
              <span>{metaRight}</span>
            </div>

            {/* Title: mobile SELALU terlihat; desktop hanya saat hover */}
            <h3 className="
              text-white font-bold text-xl leading-tight line-clamp-2
              md:opacity-0 md:translate-y-1 md:transition-all md:duration-300
              md:group-hover:opacity-100 md:group-hover:translate-y-0
            ">
              <Link href={url as any} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {t}
              </Link>
            </h3>

            {/* Description: sama seperti meta */}
            {description && (
              <p className="
                text-sm text-zinc-300/90 mt-1 line-clamp-2
                md:opacity-0 md:translate-y-1 md:transition-all md:duration-300
                md:group-hover:opacity-100 md:group-hover:translate-y-0
              ">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
