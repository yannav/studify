import type { ReactNode } from 'react'

export function AppHeader({ title, lede, children }: { title: ReactNode; lede?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-5 border-b border-line px-5 pb-6 pt-8 sm:px-8 lg:px-10 lg:pt-10">
      <div className="min-w-0">
        <h1 className="text-[clamp(28px,3vw,38px)] font-normal leading-tight tracking-[-0.045em]">{title}</h1>
        {lede && <p className="mt-1.5 text-[15px] text-muted">{lede}</p>}
      </div>
      {children}
    </div>
  )
}
