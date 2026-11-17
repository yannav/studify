import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Eyebrow } from './Badge'

export function SectionHeading({ eyebrow, title, lede, align = 'left', className, as: H = 'h2' }: { eyebrow?: string; title: ReactNode; lede?: ReactNode; align?: 'left' | 'center'; className?: string; as?: 'h1' | 'h2' }) {
  return (
    <div className={cx('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
      <H className="text-[clamp(32px,4.2vw,54px)] font-normal leading-[1.02] tracking-[-0.045em] text-fg">{title}</H>
      {lede && <p className="mt-5 text-[17px] leading-relaxed text-muted">{lede}</p>}
    </div>
  )
}
