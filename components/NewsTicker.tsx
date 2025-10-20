'use client'
import { motion, useAnimationControls } from 'framer-motion'
import Link from 'next/link'
import { useEffect } from 'react'

export default function NewsTicker({ items }: { items: { title: string; url: string }[] }) {
  const controls = useAnimationControls()
  const loop = [...items, ...items]

  useEffect(() => {
    controls.start({ x: ['0%', '-50%'], transition: { repeat: Infinity, duration: 28, ease: 'linear' } })
  }, [controls])

  return (
    <div className="border-y border-line bg-card/40">
      <div
        className="container py-3 overflow-hidden group"
        onMouseEnter={() => controls.stop()}
        onMouseLeave={() => controls.start({ x: ['0%', '-50%'], transition: { repeat: Infinity, duration: 28, ease: 'linear' } })}
      >
        <motion.div className="flex gap-8 whitespace-nowrap" animate={controls}>
          {loop.map((it, i) => (
            <Link
              key={`${i}-${it.url}`}
              href={it.url as any}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-200 hover:text-accent transition-colors"
            >
              • {it.title}
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
