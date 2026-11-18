import { useEffect, useRef, useState } from 'react'
import type { DragEvent } from 'react'
import { CloudUpload, FileCheck2, Layers, ListChecks, MessageSquareText } from 'lucide-react'

import { postJson } from '../lib/api'
import { cx } from '../lib/cx'
import { extractText, ReadError } from '../lib/extract'
import { useT } from '../lib/i18n'
import { packOf, useLibraryActions, withSubject } from '../lib/library'
import type { Doc } from '../lib/library'
import { navigate } from '../lib/router'
import { useReducedMotion } from '../lib/useReducedMotion'
import { ACCEPTED, validateUpload } from '../shared/validate'
import { Button } from './Button'
import { FileIcon } from './FileIcon'
import { Modal } from './Modal'
import { Notice } from './Notice'
import { ProgressBar } from './Progress'
import { SubjectField } from './SubjectField'

const STEPS = ['Reading your file', 'Finding the key ideas', 'Writing flashcards and a quiz']

type State = { phase: 'idle' } | { phase: 'working'; name: string; step: number } | { phase: 'error'; message: string } | { phase: 'done'; doc: Doc }

/**
 * Upload a file. The browser reads the file's text (see src/lib/extract.ts),
 * the Worker builds a study pack from that text, and the document joins the
 * library in localStorage. A file the app can't read says so and adds nothing.
 */
export function UploadDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT()
  const [state, setState] = useState<State>({ phase: 'idle' })
  const [drag, setDrag] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const { add } = useLibraryActions()
  const reduce = useReducedMotion()

  useEffect(() => {
    if (open) setState({ phase: 'idle' })
  }, [open])

  async function start(file: File) {
    const local = validateUpload({ name: file.name, size: file.size })
    if (local) return setState({ phase: 'error', message: t(local) })
    setState({ phase: 'working', name: file.name, step: 0 })

    let text: string
    try {
      text = await extractText(file)
    } catch (e) {
      const message = e instanceof ReadError ? e.message : 'We couldn’t read that file. Try saving it again, or upload a PDF or text file.'
      return setState({ phase: 'error', message: t(message) })
    }

    const tick = reduce ? 80 : 650
    const request = postJson<{ document: Doc }>('/api/upload', { name: file.name, size: file.size, text })
    for (let i = 1; i < STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, tick))
      setState((s) => (s.phase === 'working' ? { ...s, step: i } : s))
    }
    const res = await request
    await new Promise((r) => setTimeout(r, tick))
    if (!res.ok) return setState({ phase: 'error', message: t(res.error) })
    // Nothing is saved yet: the student confirms the subject in the panel below.
    setState({ phase: 'done', doc: res.data.document })
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDrag(false)
    const f = e.dataTransfer.files?.[0]
    if (f) void start(f)
  }

  // Leaving the success panel saves the pack, with whatever subject is shown.
  const finish = (doc?: Doc, path?: string) => {
    if (doc) add(withSubject(doc, packOf(doc).subject))
    onClose()
    if (path) navigate(path)
  }

  const pending = state.phase === 'done' ? state.doc : undefined
  const go = (path: string) => finish(pending, path)
  const changeSubject = (subject: string) =>
    setState((s) => (s.phase === 'done' ? { ...s, doc: { ...s.doc, pack: { ...packOf(s.doc), subject } } } : s))

  return (
    <Modal
      open={open}
      onClose={() => finish(pending)}
      title={state.phase === 'done' ? t('Your study pack is ready') : t('Upload a file')}
      description={state.phase === 'done' ? t('Check the subject, then choose where to start.') : t('PDF, Word, PowerPoint or text, up to 25 MB.')}
    >
      {state.phase === 'working' ? (
        <div className="grid gap-5" aria-live="polite">
          <div className="flex items-center gap-3">
            <FileIcon kind="pdf" />
            <p className="truncate text-[15px] font-medium">{state.name}</p>
          </div>
          <ProgressBar label={t('Analysing file')} value={state.step + 1} max={STEPS.length + 1} />
          <ul className="grid gap-2.5 text-[14px]">
            {STEPS.map((s, i) => (
              <li key={s} className={cx('flex items-center gap-2.5', i <= state.step ? 'text-fg' : 'text-faint')}>
                <span className={cx('round size-2 rounded-full', i < state.step ? 'bg-leaf' : i === state.step ? 'animate-pulse bg-leaf-text' : 'bg-white/15')} />
                {t(s)}
              </li>
            ))}
          </ul>
        </div>
      ) : state.phase === 'done' ? (
        <DonePanel doc={state.doc} onSubject={changeSubject} go={go} />
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
            <span className="text-[16px] font-medium">{t('Drop a file here, or choose one')}</span>
            <span className="text-[13.5px] text-muted">{t('Your file is read in your browser. Only its text is sent to build the pack.')}</span>
            <input
              ref={input}
              type="file"
              className="sr-only"
              accept={ACCEPTED.map((e) => '.' + e).join(',')}
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) void start(f)
                e.target.value = ''
              }}
            />
          </label>
          {state.phase === 'error' && <Notice tone="error">{state.message}</Notice>}
        </div>
      )}
    </Modal>
  )
}

function DonePanel({ doc, onSubject, go }: { doc: Doc; onSubject: (subject: string) => void; go: (p: string) => void }) {
  const t = useT()
  const pack = packOf(doc)
  return (
    <div className="grid gap-5">
      <div className="flex items-start gap-3 rounded-2xl border border-leaf/25 bg-leaf-soft p-4">
        <FileCheck2 aria-hidden className="mt-0.5 size-5 shrink-0 text-leaf-text" />
        <div className="min-w-0">
          <p className="truncate text-[15px] font-medium">{doc.name}</p>
          <p className="mt-0.5 text-[13.5px] text-muted">
            {t('{n} flashcards', { n: pack.cards.length })} · {t('{n}-question quiz', { n: pack.quiz.length })} · {pack.title}
          </p>
        </div>
      </div>
      <SubjectField value={pack.subject} onChange={onSubject} hint={t('Studify guessed this from the text. Change it if it is wrong.')} />
      <div className="grid gap-2 sm:grid-cols-3">
        <Button variant="leaf" icon={<MessageSquareText className="size-4" />} onClick={() => go(`/app/chat?doc=${doc.id}`)}>
          {t('Ask')}
        </Button>
        <Button variant="glass" icon={<Layers className="size-4" />} onClick={() => go(`/app/flashcards?doc=${doc.id}`)}>
          {t('Flashcards')}
        </Button>
        <Button variant="glass" icon={<ListChecks className="size-4" />} onClick={() => go(`/app/quiz?doc=${doc.id}`)}>
          {t('Quiz')}
        </Button>
      </div>
    </div>
  )
}
