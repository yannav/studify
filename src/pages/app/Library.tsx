import { useEffect, useMemo, useState } from 'react'
import { Flame, Layers, ListChecks, MessageSquareText, Search, Sparkles, Trash2, Upload } from 'lucide-react'

import { Badge } from '../../components/Badge'
import { Button, ButtonLink, IconButton } from '../../components/Button'
import { EmptyState } from '../../components/EmptyState'
import { FileIcon, KIND_LABEL } from '../../components/FileIcon'
import { Modal } from '../../components/Modal'
import { Notice } from '../../components/Notice'
import { Segmented } from '../../components/Segmented'
import { Skeleton } from '../../components/Skeleton'
import { useToast } from '../../components/Toast'
import { UploadDialog } from '../../components/UploadDialog'
import { cardKey, docTitle, dueCount, packOf, streak, useAttempts, useCardStates, useDays, useDocs, useLibraryActions, useUser } from '../../lib/library'
import type { Doc } from '../../lib/library'
import { useLocation } from '../../lib/router'
import { AppHeader } from './AppHeader'

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

const SIZE = (n: number) => (n > 1_000_000 ? `${(n / 1_000_000).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1000))} KB`)
const DATE = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export function LibraryPage() {
  const [docs] = useDocs()
  const [user] = useUser()
  const [states] = useCardStates()
  const [attempts] = useAttempts()
  const [days] = useDays()
  const { search } = useLocation()
  const welcome = new URLSearchParams(search).get('welcome') === '1'
  const [ready, setReady] = useState(false)
  const [q, setQ] = useState('')
  const [subject, setSubject] = useState('all')
  const [upload, setUpload] = useState(false)
  const [doomed, setDoomed] = useState<Doc | null>(null)
  const { remove } = useLibraryActions()
  const toast = useToast()

  // A short skeleton, as a real app would show while the library loads.
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 380)
    return () => window.clearTimeout(t)
  }, [])

  const subjects = useMemo(() => [...new Set(docs.map((d) => packOf(d).subject))], [docs])
  const shown = docs.filter((d) => {
    const p = packOf(d)
    const hit = !q || `${d.name} ${p.title} ${p.subject}`.toLowerCase().includes(q.toLowerCase())
    return hit && (subject === 'all' || p.subject === subject)
  })
  const avg = attempts.length ? Math.round((attempts.reduce((n, a) => n + a.score / a.total, 0) / attempts.length) * 100) : null
  const due = dueCount(docs, states)

  return (
    <>
      <AppHeader title={`${greeting()}${user ? `, ${user.name.split(' ')[0]}` : ''}`} lede="Here is everything you are studying.">
        <Button variant="paper" icon={<Upload className="size-4" />} onClick={() => setUpload(true)}>
          Upload file
        </Button>
      </AppHeader>

      <div className="grid gap-8 px-5 py-8 sm:px-8 lg:px-10">
        {welcome && <Notice tone="success">Your account is ready. We added three sample files so you can try everything straight away.</Notice>}

        <dl className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {[
            { label: 'Day streak', value: streak(days), icon: Flame },
            { label: 'Cards due', value: due, icon: Layers },
            { label: 'Quiz average', value: avg === null ? 'None yet' : `${avg}%`, icon: ListChecks },
            { label: 'Files', value: docs.length, icon: Sparkles },
          ].map((s) => (
            <div key={s.label} className="panel rounded-[22px] p-5">
              <dt className="flex items-center gap-2 text-[13.5px] text-muted">
                <s.icon aria-hidden className="size-4 text-leaf-text" /> {s.label}
              </dt>
              <dd className="mt-3 text-[30px] font-normal leading-none tracking-[-0.04em]">{s.value}</dd>
            </div>
          ))}
        </dl>

        {docs.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-[300px]">
              <label htmlFor="lib-search" className="sr-only">
                Search files
              </label>
              <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-faint" />
              <input id="lib-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search files" className="field h-11 pl-11" />
            </div>
            <div className="max-w-full overflow-x-auto">
              <Segmented label="Subject" value={subject} onChange={setSubject} options={[{ value: 'all', label: 'All' }, ...subjects.map((s) => ({ value: s, label: s }))]} />
            </div>
          </div>
        )}

        {!ready ? (
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3" aria-busy="true" aria-label="Loading library">
            {[0, 1, 2].map((i) => (
              <div key={i} className="panel grid gap-4 rounded-[26px] p-6">
                <Skeleton className="size-12" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-11 w-full" />
              </div>
            ))}
          </div>
        ) : docs.length === 0 ? (
          <EmptyState
            icon={<Upload className="size-6" />}
            title="Nothing here yet"
            body="Upload lecture slides, notes or a photo of the board to build your first study pack."
            action={
              <Button variant="paper" onClick={() => setUpload(true)}>
                Upload your first file
              </Button>
            }
          />
        ) : shown.length === 0 ? (
          <EmptyState
            icon={<Search className="size-6" />}
            title="No files match"
            body={`Nothing in your library matches “${q}”${subject !== 'all' ? ` in ${subject}` : ''}.`}
            action={
              <Button
                variant="glass"
                onClick={() => {
                  setQ('')
                  setSubject('all')
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {shown.map((d) => {
              const p = packOf(d)
              const dueHere = p.cards.filter((c) => (states[cardKey(d.id, c.id)]?.due ?? 0) <= Date.now()).length
              const best = attempts.filter((a) => a.docId === d.id).reduce((m, a) => Math.max(m, Math.round((a.score / a.total) * 100)), -1)
              return (
                <li key={d.id} className="panel flex animate-pop flex-col rounded-[26px] p-6">
                  <div className="flex items-start justify-between gap-3">
                    <FileIcon kind={d.kind} size="lg" />
                    <IconButton label={`Delete ${docTitle(d)}`} variant="ghost" size="sm" onClick={() => setDoomed(d)}>
                      <Trash2 className="size-4" />
                    </IconButton>
                  </div>
                  <h2 className="mt-5 text-[18px] font-medium leading-snug tracking-[-0.02em]">{docTitle(d)}</h2>
                  <p className="mt-1 text-[13.5px] text-muted">
                    {KIND_LABEL[d.kind]}, {p.pages} pages, {SIZE(d.size)}, added {DATE(d.addedAt)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge>{p.subject}</Badge>
                    <Badge tone={dueHere ? 'amber' : 'leaf'}>{dueHere ? `${dueHere} cards due` : 'All cards reviewed'}</Badge>
                    {best >= 0 && <Badge tone="leaf">Best quiz {best}%</Badge>}
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-2 pt-1">
                    <ButtonLink href={`/app/chat?doc=${d.id}`} variant="tint" size="sm" className="h-10 px-2" icon={<MessageSquareText className="size-4" />}>
                      Ask
                    </ButtonLink>
                    <ButtonLink href={`/app/flashcards?doc=${d.id}`} variant="glass" size="sm" className="h-10 px-2" icon={<Layers className="size-4" />}>
                      Cards
                    </ButtonLink>
                    <ButtonLink href={`/app/quiz?doc=${d.id}`} variant="glass" size="sm" className="h-10 px-2" icon={<ListChecks className="size-4" />}>
                      Quiz
                    </ButtonLink>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <UploadDialog open={upload} onClose={() => setUpload(false)} />
      <Modal open={!!doomed} onClose={() => setDoomed(null)} title="Delete this file?" description={doomed ? `${docTitle(doomed)} and its chat, card progress and quiz scores will be removed.` : undefined}>
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="ghost" onClick={() => setDoomed(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            icon={<Trash2 className="size-4" />}
            onClick={() => {
              if (!doomed) return
              remove(doomed.id)
              toast(`Deleted ${docTitle(doomed)}`)
              setDoomed(null)
            }}
          >
            Delete file
          </Button>
        </div>
      </Modal>
    </>
  )
}
