import { useId, useState } from 'react'
import { Plus } from 'lucide-react'

import { cx } from '../lib/cx'

export function Accordion({ items, className }: { items: { q: string; a: string }[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0)
  const base = useId()
  return (
    <div className={cx('divide-y divide-line border-y border-line', className)}>
      {items.map((it, i) => {
        const on = open === i
        return (
          <div key={it.q}>
            <h3>
              <button
                type="button"
                id={`${base}-h${i}`}
                aria-expanded={on}
                aria-controls={`${base}-p${i}`}
                onClick={() => setOpen(on ? null : i)}
                className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-medium tracking-[-0.02em] text-fg transition-colors hover:text-leaf-text"
              >
                {it.q}
                <Plus aria-hidden className={cx('size-5 shrink-0 text-leaf-text transition-transform duration-300', on && 'rotate-45')} />
              </button>
            </h3>
            <div id={`${base}-p${i}`} role="region" aria-labelledby={`${base}-h${i}`} hidden={!on} className="pb-6 pr-10 text-[15.5px] leading-relaxed text-muted">
              {it.a}
            </div>
          </div>
        )
      })}
    </div>
  )
}
