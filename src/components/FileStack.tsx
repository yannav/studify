import { useState } from 'react'

import { HERO } from '../content'
import { cx } from '../lib/cx'
import { FileIcon } from './FileIcon'

type Kind = (typeof HERO.files)[number]['kind']

// Offsets per depth: 0 is the front card. Mirrors the fanned stack in the hero.
const POS = [
  { x: 18, y: 84, z: 30, r: -1.5 },
  { x: 52, y: 30, z: 20, r: 3 },
  { x: 0, y: 0, z: 10, r: -3 },
]

/**
 * The fanned file cards in the hero. Each card is a tab: choosing a card
 * brings it to the front and shows what Cramly does with that file type.
 */
export function FileStack({ className }: { className?: string }) {
  const [order, setOrder] = useState<Kind[]>(['pdf', 'doc', 'png'])
  const files = Object.fromEntries(HERO.files.map((f) => [f.kind, f])) as Record<Kind, (typeof HERO.files)[number]>
  return (
    <div role="tablist" aria-label="File types Cramly reads" className={cx('relative h-[300px] w-[300px]', className)}>
      {HERO.files.map((f) => {
        const depth = order.indexOf(f.kind)
        const p = POS[depth]
        const front = depth === 0
        return (
          <button
            key={f.kind}
            type="button"
            role="tab"
            aria-selected={front}
            aria-controls="file-stack-panel"
            tabIndex={front ? 0 : -1}
            onClick={() => setOrder((o) => [f.kind, ...o.filter((k) => k !== f.kind)])}
            onKeyDown={(e) => {
              if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
              e.preventDefault()
              const next = e.key === 'ArrowRight' ? order[order.length - 1] : order[1]
              setOrder((o) => [next, ...o.filter((k) => k !== next)])
              requestAnimationFrame(() => document.getElementById(`file-tab-${next}`)?.focus())
            }}
            id={`file-tab-${f.kind}`}
            className={cx(
              'glass absolute left-0 top-0 flex h-[196px] w-[250px] flex-col rounded-[24px] p-5 text-left transition-[transform,opacity,filter] duration-500 ease-[var(--ease-brand)]',
              front ? 'cursor-default bg-[#173a20]/55' : 'cursor-pointer bg-[#0c1a10]/80 hover:bg-[#12261a]/90',
            )}
            style={{ transform: `translate(${p.x}px, ${p.y}px) rotate(${p.r}deg)`, zIndex: p.z }}
          >
            <span className="flex items-start justify-between gap-3">
              <span className="text-[15px] tracking-[-0.01em] text-fg">{f.label}</span>
              <FileIcon kind={f.kind} size="sm" />
            </span>
            {front && (
              <span id="file-stack-panel" role="tabpanel" className="mt-5 block animate-pop text-[15.5px] leading-[1.32] tracking-[-0.01em] text-soft">
                <strong className="font-semibold text-fg">{files[f.kind].lead}</strong> {files[f.kind].body}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
