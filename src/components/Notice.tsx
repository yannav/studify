import type { ReactNode } from 'react'
import { CircleAlert, CircleCheck, Info } from 'lucide-react'

import { cx } from '../lib/cx'

const STYLES = {
  success: { cls: 'border-leaf/30 bg-leaf-soft text-leaf-text', Icon: CircleCheck },
  error: { cls: 'border-danger/30 bg-danger-soft text-danger', Icon: CircleAlert },
  info: { cls: 'border-line-strong bg-white/5 text-soft', Icon: Info },
}

export function Notice({ tone = 'info', children, className }: { tone?: keyof typeof STYLES; children: ReactNode; className?: string }) {
  const { cls, Icon } = STYLES[tone]
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cx('flex items-start gap-3 rounded-2xl border px-4 py-3 text-[14px] leading-snug', cls, className)}>
      <Icon aria-hidden className="mt-px size-4.5 shrink-0" />
      <div>{children}</div>
    </div>
  )
}
