'use client'
import { motion } from 'framer-motion'

export default function FancyHeading({ kicker, title, deck }:{
  kicker?: string; title: string; deck?: string
}) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      {kicker && <div className="text-accent font-semibold tracking-wide uppercase text-xs mb-2">{kicker}</div>}
      <motion.h2
        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: .5 }}
        className="text-4xl md:text-5xl font-extrabold"
      >
        {title}
      </motion.h2>
      {deck && <p className="text-muted mt-3">{deck}</p>}
    </div>
  )
}
