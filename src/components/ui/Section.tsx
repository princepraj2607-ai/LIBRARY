import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Props = {
  id?: string
  eyebrow?: string
  title?: string
  intro?: string
  children: ReactNode
  className?: string
  dark?: boolean
}

export function Section({ id, eyebrow, title, intro, children, className = '', dark = false }: Props) {
  return (
    <section id={id} className={`px-5 py-20 sm:px-8 lg:px-12 lg:py-28 ${dark ? 'bg-navy text-ivory' : 'bg-ivory text-navy'} ${className}`}>
      <div className="mx-auto max-w-6xl">
        {(eyebrow || title) && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="mb-12 max-w-3xl"
          >
            {eyebrow && (
              <p className="mb-3 text-xs font-medium tracking-[0.32em] text-gold uppercase">{eyebrow}</p>
            )}
            {title && (
              <h2 className="font-serif text-4xl leading-tight sm:text-5xl">{title}</h2>
            )}
            {intro && (
              <p className={`mt-4 text-base leading-relaxed ${dark ? 'text-mist' : 'text-navy/70'}`}>{intro}</p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  )
}
