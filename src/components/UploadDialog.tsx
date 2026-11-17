import { useEffect, useRef, useState } from 'react'
import type { DragEvent } from 'react'
import { CloudUpload, FileCheck2, Layers, ListChecks, MessageSquareText } from 'lucide-react'

import { postJson } from '../lib/api'
import { cx } from '../lib/cx'
import { packOf, useLibraryActions } from '../lib/library'
import type { Doc } from '../lib/library'
import { navigate } from '../lib/router'
import { useReducedMotion } from '../lib/useReducedMotion'
import { ACCEPTED, validateUpload } from '../shared/validate'
import { Button } from './Button'
import { FileIcon } from './FileIcon'
import { Modal } from './Modal'
import { Notice } from './Notice'
import { ProgressBar } from './Progress'

const SAMPLES = [
  { name: 'Photosynthesis lecture slides.pptx', size: 8_400_000 },
  { name: 'ECON 110 Supply and demand.pdf', size: 3_100_000 },
]

const STEPS = ['Reading pages', 'Finding the key ideas', 'Writing flashcards and a quiz']

type State = { phase: 'idle' } | { phase: 'working'; name: string; step: number } | { phase: 'error'; message: string } | { phase: 'done'; doc: Doc }

/**
 * Upload a file (or a sample). The Worker validates the name and size and
 * returns a study pack; the document then joins the library in localStorage.
 * Nothing is sent but the file's name and size.
 */
export function UploadDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [state, setState] = useState<State>({ phase: 'idle' })
  const [drag, setDrag] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const { add } = useLibraryActions()
  const reduce = useReducedMotion()

  useEffect(() => {
    if (open) setState({ phase: 'idle' })
  }, [open])

  async function start(name: string, size: number) {
    const local = validateUpload({ name, size })
    if (local) return setState({ phase: 'error', message: local })
    setState({ phase: 'working', name, step: 0 })
    const tick = reduce ? 80 : 650
    const request = postJson<{ document: Doc }>('/api/upload', { name, size })
    for (let i = 1; i < STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, tick))
      setState((s) => (s.phase === 'working' ? { ...s, step: i } : s))
    }
    const res = await request
    await new Promise((r) => setTimeout(r, tick))
    if (!res.ok) return setState({ phase: 'error', message: res.error })
    add(res.data.document)
    setState({ phase: 'done', doc: res.data.document })
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDrag(false)
    const f = e.dataTransfer.files?.[0]
    if (f) void start(f.name, f.size)
  }

  const go = (path: string) => {
    onClose()
    navigate(path)
  }

  return (
    <Modal open={open} onClose={onClose} title={state.phase === 'done' ? 'Your study pack is ready' : 'Upload a file'} description={state.phase === 'done' ? undefined : 'PDF, Word, PowerPoint, images or text, up to 25 MB.'}>
      {state.phase === 'working' ? (
        <div className="grid gap-5" aria-live="polite">
          <div className="flex items-center gap-3">
            <FileIcon kind="pdf" />
            <p className="truncate text-[15px] font-medium">{state.name}</p>
          </div>
          <ProgressBar label="Analysing file" value={state.step + 1} max={STEPS.length + 1} />
          <ul className="grid gap-2.5 text-[14px]">
            {STEPS.map((s, i) => (
              <li key={s} className={cx('flex items-center gap-2.5', i <= state.step ? 'text-fg' : 'text-faint')}>
                <span className={cx('round size-2 rounded-full', i < state.step ? 'bg-leaf' : i === state.step ? 'animate-pulse bg-leaf-text' : 'bg-white/15')} />
                {s}
              </li>
            ))}
          </ul>
        </div>
      ) : state.phase === 'done' ? (
        <DonePanel doc={state.doc} go={go} />
      ) : (
        <div className="grid gap-4">
          <label
            onDragOver={(e) => {
              e.preventDefault()
              setDrag(true)
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            className={cx(
              'grid cursor-pointer place-items-center gap-3 rounded-[24px] border border-dashed px-6 py-10 text-center transition-colors focus-within:border-leaf',
              drag ? 'border-leaf bg-leaf-soft' : 'border-line-strong bg-white/3 hover:border-leaf/50 hover:bg-white/5',
            )}
          >
            <span className="grid size-14 place-items-center rounded-2xl bg-leaf-soft text-leaf-text">
              <CloudUpload aria-hidden className="size-6" />
            </span>
            <span className="text-[16px] font-medium">Drop a file here, or choose one</span>
            <span className="text-[13.5px] text-muted">Only the file name and size leave your browser in this demo.</span>
            <input
              ref={input}
              type="file"
              className="sr-only"
              accept={ACCEPTED.map((e) => '.' + e).join(',')}
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) void start(f.name, f.size)
                e.target.value = ''
              }}
            />
          </label>
          {state.phase === 'error' && <Notice tone="error">{state.message}</Notice>}
          <div>
            <p className="mb-2.5 text-[13px] text-faint">No file handy? Try a sample:</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {SAMPLES.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => void start(s.name, s.size)}
                  className="flex min-h-12 items-center gap-2.5 rounded-2xl border border-line bg-white/4 px-3 py-2 text-left text-[13.5px] text-soft transition-colors hover:border-leaf/40 hover:text-fg"
                >
                  <FileIcon kind={s.name.endsWith('.pdf') ? 'pdf' : 'ppt'} size="sm" />
                  <span className="truncate">{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

function DonePanel({ doc, go }: { doc: Doc; go: (p: string) => void }) {
  const pack = packOf(doc)
  return (
    <div className="grid gap-5">
      <div className="flex items-start gap-3 rounded-2xl border border-leaf/25 bg-leaf-soft p-4">
        <FileCheck2 aria-hidden className="mt-0.5 size-5 shrink-0 text-leaf-text" />
        <div className="min-w-0">
          <p className="truncate text-[15px] font-medium">{doc.name}</p>
          <p className="mt-0.5 text-[13.5px] text-muted">
            Read as {pack.subject}: {pack.title}. {pack.cards.length} flashcards and {pack.quiz.length} quiz questions.
          </p>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <Button variant="leaf" icon={<MessageSquareText className="size-4" />} onClick={() => go(`/app/chat?doc=${doc.id}`)}>
          Ask
        </Button>
        <Button variant="glass" icon={<Layers className="size-4" />} onClick={() => go(`/app/flashcards?doc=${doc.id}`)}>
          Flashcards
        </Button>
        <Button variant="glass" icon={<ListChecks className="size-4" />} onClick={() => go(`/app/quiz?doc=${doc.id}`)}>
          Quiz
        </Button>
      </div>
    </div>
  )
}
