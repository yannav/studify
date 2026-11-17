import type { ReactNode } from 'react'

import { Eyebrow } from './Badge'
import { Container } from './Container'

export function PageIntro({ eyebrow, title, lede, children }: { eyebrow: string; title: ReactNode; lede?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden pb-10 pt-20 md:pt-28">
      <div aria-hidden className="absolute left-1/2 top-0 -z-10 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(47_194_76/0.22),transparent)] blur-2xl" />
      <Container>
        <Eyebrow className="mb-5">{eyebrow}</Eyebrow>
        <h1 className="max-w-3xl text-[clamp(40px,5.6vw,76px)] font-normal leading-[0.98] tracking-[-0.055em]">{title}</h1>
        {lede && <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-muted">{lede}</p>}
        {children}
      </Container>
    </section>
  )
}
