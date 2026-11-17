import { cx } from '../lib/cx'
import { Link } from '../lib/router'
import { BRAND } from '../content'

/** Cramly's mark: a four-point spark, drawn as two crossed strokes. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cx('size-6', className)}>
      <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.2" fill="var(--color-leaf)" />
    </svg>
  )
}

export function Logo({ className, withName = false, href = '/' }: { className?: string; withName?: boolean; href?: string }) {
  return (
    <Link href={href} className={cx('inline-flex min-h-10 min-w-10 items-center gap-2.5 text-fg', className)} aria-label={`${BRAND.name} home`}>
      <Mark className="size-7" />
      {withName && <span className="text-[19px] font-medium tracking-[-0.04em]">{BRAND.name}</span>}
    </Link>
  )
}
