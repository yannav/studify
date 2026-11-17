import { cx } from '../lib/cx'

export function ProgressBar({ value, max = 100, label, className }: { value: number; max?: number; label: string; className?: string }) {
  const pct = max ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} className={cx('h-2 overflow-hidden rounded-full bg-white/8', className)}>
      <div className="h-full rounded-full bg-leaf shadow-[0_0_16px_var(--color-glow)] transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
    </div>
  )
}

/** Circular score, e.g. a quiz result. */
export function ScoreRing({ value, max, size = 132, label }: { value: number; max: number; size?: number; label?: string }) {
  const r = size / 2 - 8
  const c = 2 * Math.PI * r
  const pct = max ? value / max : 0
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }} role="img" aria-label={label ?? `${value} out of ${max}`}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="8" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-leaf)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 900ms var(--ease-brand)', filter: 'drop-shadow(0 0 8px rgb(126 224 104 / 0.6))' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-[30px] font-medium tracking-[-0.04em]">{Math.round(pct * 100)}%</div>
        <div className="text-[12.5px] text-muted">
          {value} of {max}
        </div>
      </div>
    </div>
  )
}
