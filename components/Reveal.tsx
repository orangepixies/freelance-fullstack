'use client'

import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useReducedMotion } from 'framer-motion'


export default function Reveal({
  children,
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
}) {
  const controls = useAnimation()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })
  const preferReduce = useReducedMotion()
const initial = preferReduce ? {opacity:0} : {opacity:0, y:12}
const animate = preferReduce ? {opacity:1} : {opacity:1, y:0}
  

  useEffect(() => {
    if (inView) controls.start({ opacity: 1, y: 0 })
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={controls}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
