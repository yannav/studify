import { cx } from '../lib/cx'

/*
  The small technical marks scattered around the hero (a cross, a plus and a
  slashed N). Purely decorative.
*/
function Cross() {
  return <path d="M3 3l10 10M13 3L3 13" />
}
function Plus() {
  return <path d="M8 2v12M2 8h12" />
}
function Slash() {
  return <path d="M3 13V3l10 10V3M2 2l12 12" />
}

const SHAPES = { x: Cross, plus: Plus, n: Slash }

export function Glyph({ shape, className }: { shape: keyof typeof SHAPES; className?: string }) {
  const S = SHAPES[shape]
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden className={cx('size-4', className)}>
      <S />
    </svg>
  )
}

export function GlyphRow({ vertical, className }: { vertical?: boolean; className?: string }) {
  return (
    <div aria-hidden className={cx('flex gap-2.5 text-soft/80', vertical ? 'flex-col items-center' : 'items-center', className)}>
      <Glyph shape="x" />
      <Glyph shape="plus" />
      <Glyph shape="n" />
    </div>
  )
}
