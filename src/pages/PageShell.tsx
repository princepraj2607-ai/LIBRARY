import type { ReactNode } from 'react'

export function PageShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <div className="bg-navy">
      <div className="px-5 pb-10 pt-32 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs tracking-[0.32em] text-gold uppercase">{eyebrow}</p>
          <h1 className="mt-3 font-serif text-5xl text-ivory">{title}</h1>
        </div>
      </div>
      {children}
    </div>
  )
}
