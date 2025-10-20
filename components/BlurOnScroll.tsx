'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { PropsWithChildren, useRef } from 'react'

export default function BlurOnScroll({
  children,
  maxBlurPx = 20,
  minOpacity = 0.75,
}: PropsWithChildren<{ maxBlurPx?: number; minOpacity?: number }>) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const blur = useTransform(scrollYProgress, [0, 1], ['0px', `${maxBlurPx}px`])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, minOpacity])

  return (
    <motion.div ref={ref} style={{ filter: blur as any, opacity }}>
      {children}
    </motion.div>
  )
}
