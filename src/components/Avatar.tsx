import { cx } from '../lib/cx'

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export function Avatar({ name, size = 40, className }: { name: string; size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cx('round inline-grid shrink-0 place-items-center rounded-full border border-leaf/25 bg-gradient-to-br from-leaf-deep to-panel-2 font-medium text-leaf-text', className)}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials(name)}
    </span>
  )
}
