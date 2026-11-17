import { FileImage, FileText, FileType2, Presentation, ScrollText } from 'lucide-react'

import { cx } from '../lib/cx'
import type { DocKind } from '../lib/library'

const ICONS = { pdf: FileType2, doc: FileText, png: FileImage, txt: ScrollText, ppt: Presentation }
export const KIND_LABEL: Record<DocKind, string> = { pdf: 'PDF', doc: 'DOC', png: 'Image', txt: 'Text', ppt: 'Slides' }

export function FileIcon({ kind, className, size = 'md' }: { kind: DocKind; className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const Icon = ICONS[kind]
  return (
    <span
      aria-hidden
      className={cx(
        'inline-grid shrink-0 place-items-center border border-white/15 bg-white/10 text-fg shadow-[inset_0_1px_0_rgb(255_255_255/0.2)] backdrop-blur',
        size === 'sm' && 'size-7 rounded-lg',
        size === 'md' && 'size-9 rounded-xl',
        size === 'lg' && 'size-12 rounded-2xl',
        className,
      )}
    >
      <Icon className={size === 'lg' ? 'size-5.5' : 'size-4'} strokeWidth={1.7} />
    </span>
  )
}
