import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export function EmptyState({ icon, title, body, action, className }: { icon: ReactNode; title: string; body: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cx('grid place-items-center gap-4 rounded-[26px] border border-dashed border-line-strong px-6 py-14 text-center', className)}>
      <div className="grid size-14 place-items-center rounded-2xl bg-leaf-soft text-leaf-text">{icon}</div>
      <div>
        <h3 className="text-[19px] font-medium tracking-[-0.02em]">{title}</h3>
        <p className="mx-auto mt-1.5 max-w-sm text-[14.5px] text-muted">{body}</p>
      </div>
      {action}
    </div>
  )
}
