import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export type Tone = 'neutral' | 'leaf' | 'amber' | 'danger'

const TONES: Record<Tone, string> = {
  neutral: 'bg-white/6 text-soft border-white/10',
  leaf: 'bg-leaf-soft text-leaf-text border-leaf/25',
  amber: 'bg-amber-soft text-amber border-amber/25',
  danger: 'bg-danger-soft text-danger border-danger/25',
}

export function Badge({ tone = 'neutral', icon, children, className }: { tone?: Tone; icon?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <span className={cx('inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-medium', TONES[tone], className)}>
      {icon}
      {children}
    </span>
  )
}

/** Small eyebrow label above a section title. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx('inline-flex items-center gap-2 text-[13px] font-medium text-leaf-text', className)}>
      <span aria-hidden className="round size-1.5 rounded-full bg-leaf shadow-[0_0_12px_var(--color-leaf)]" />
      {children}
    </p>
  )
}
