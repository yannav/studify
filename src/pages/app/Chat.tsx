import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { ArrowUp, Eraser, Layers, ListChecks } from 'lucide-react'

import { Badge } from '../../components/Badge'
import { ButtonLink, IconButton } from '../../components/Button'
import { ChatBubble } from '../../components/ChatBubble'
import { FileIcon } from '../../components/FileIcon'
import { TypingDots } from '../../components/TypingDots'
import { postJson } from '../../lib/api'
import { docTitle, markStudied, packOf, useChats } from '../../lib/library'
import type { ChatMessage } from '../../lib/library'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { validateQuestion } from '../../shared/validate'
import { AppHeader } from './AppHeader'
import { DocPicker } from './DocPicker'
import { NoDocs } from './NoDocs'
import { useActiveDoc } from './useActiveDoc'

type Reply = { text: string; cite: string | null; suggestions: string[] }

const uid = () => Math.random().toString(36).slice(2, 10)

/**
 * The scripted tutor. Questions go to POST /api/chat, which answers from the
 * document's study pack; the reply is revealed word by word like a stream.
 */
export function ChatPage() {
  const [doc, docs, pick] = useActiveDoc()
  const [chats, setChats] = useChats()
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [streaming, setStreaming] = useState<{ id: string; shown: string; full: Reply } | null>(null)
  const [suggestions, setSuggestions] = useState<string[] | null>(null)
  const end = useRef<HTMLDivElement>(null)
  const box = useRef<HTMLTextAreaElement>(null)
  const reduce = useReducedMotion()

  const thread = doc ? chats[doc.id] ?? [] : []

  useEffect(() => {
    setSuggestions(null)
    setDraft('')
    setError(null)
  }, [doc?.id])

  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end', behavior: reduce ? 'auto' : 'smooth' })
  }, [thread.length, pending, streaming?.shown, reduce])

  if (!doc) return <NoDocs what="a tutor" />
  const pack = packOf(doc)
  const chips = suggestions ?? pack.suggestions

  const append = (m: ChatMessage) => setChats((c) => ({ ...c, [doc.id]: [...(c[doc.id] ?? []), m] }))

  async function ask(text: string, retryOf?: string) {
    const err = validateQuestion(text)
    if (err) return setError(err)
    if (!doc) return
    setError(null)
    if (retryOf) setChats((c) => ({ ...c, [doc.id]: (c[doc.id] ?? []).filter((m) => m.id !== retryOf) }))
    else append({ id: uid(), from: 'you', text: text.trim() })
    setDraft('')
    setPending(true)
    const res = await postJson<{ reply: Reply }>('/api/chat', { packId: doc.packId, message: text })
    await new Promise((r) => setTimeout(r, reduce ? 0 : 500))
    setPending(false)
    if (!res.ok) {
      append({ id: uid(), from: 'cramly', text: res.error, error: true, cite: text })
      return
    }
    markStudied()
    const reply = res.data.reply
    const id = uid()
    if (reduce) {
      append({ id, from: 'cramly', text: reply.text, cite: reply.cite })
      setSuggestions(reply.suggestions)
      return
    }
    const words = reply.text.split(/(\s+)/)
    let i = 0
    setStreaming({ id, shown: '', full: reply })
    const timer = window.setInterval(() => {
      i += 3
      if (i >= words.length) {
        window.clearInterval(timer)
        setStreaming(null)
        append({ id, from: 'cramly', text: reply.text, cite: reply.cite })
        setSuggestions(reply.suggestions)
        box.current?.focus()
        return
      }
      setStreaming({ id, shown: words.slice(0, i).join(''), full: reply })
    }, 45)
  }

  const busy = pending || !!streaming
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!busy) void ask(draft)
  }
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!busy) void ask(draft)
    }
  }

  return (
    <div className="flex min-h-[calc(100svh-64px)] flex-col lg:h-svh lg:min-h-0">
      <AppHeader title="Ask Cramly" lede="Answers come only from your file, with the page they came from.">
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <DocPicker doc={doc} docs={docs} onChange={pick} />
          <IconButton className="shrink-0" label="Clear conversation" disabled={!thread.length || busy} onClick={() => setChats((c) => ({ ...c, [doc.id]: [] }))}>
            <Eraser className="size-4" />
          </IconButton>
        </div>
      </AppHeader>

      <div className="grid min-h-0 flex-1 xl:grid-cols-[1fr_340px]">
        <section aria-label="Conversation" className="flex min-h-0 flex-col">
          <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-8 lg:px-10" aria-live="polite">
            <div className="mx-auto grid max-w-3xl gap-5">
              <ChatBubble from="cramly" text={`I have read **${docTitle(doc)}** (${pack.pages} pages). Ask me anything about it, or pick a question below.`} />
              {thread.map((m) => (
                <ChatBubble key={m.id} from={m.from} text={m.text} cite={m.error ? null : m.cite} error={m.error} onRetry={m.error && m.cite ? () => void ask(m.cite as string, m.id) : undefined} />
              ))}
              {pending && (
                <ChatBubble from="cramly">
                  <TypingDots />
                </ChatBubble>
              )}
              {streaming && <ChatBubble from="cramly" text={streaming.shown + ' ▍'} />}
              <div ref={end} />
            </div>
          </div>

          <div className="border-t border-line bg-bg/80 px-5 pb-5 pt-4 backdrop-blur sm:px-8 lg:px-10">
            <div className="mx-auto max-w-3xl">
              {!busy && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {chips.map((s) => (
                    <button key={s} type="button" onClick={() => void ask(s)} className="min-h-10 rounded-full border border-line-strong bg-white/4 px-4 text-[13.5px] text-soft transition-colors hover:border-leaf/40 hover:text-fg">
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <form onSubmit={submit} className="glass flex items-end gap-2 rounded-[24px] p-2 pl-4">
                <label htmlFor="ask" className="sr-only">
                  Ask a question about {docTitle(doc)}
                </label>
                <textarea
                  id="ask"
                  ref={box}
                  rows={1}
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value)
                    setError(null)
                  }}
                  onKeyDown={onKey}
                  placeholder="Ask about this file…"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? 'ask-err' : 'ask-hint'}
                  className="max-h-40 min-h-11 flex-1 resize-none bg-transparent py-2.5 text-[15px] outline-none placeholder:text-faint"
                />
                <IconButton type="submit" label="Send" variant="leaf" disabled={busy}>
                  <ArrowUp className="size-5" />
                </IconButton>
              </form>
              {error ? (
                <p id="ask-err" className="mt-2 text-[13px] text-danger">
                  {error}
                </p>
              ) : (
                <p id="ask-hint" className="mt-2 text-[12.5px] text-faint">
                  Enter to send, Shift and Enter for a new line. This demo answers from a script, no model is called.
                </p>
              )}
            </div>
          </div>
        </section>

        <aside aria-label="About this file" className="hidden border-l border-line p-6 xl:block xl:overflow-y-auto">
          <div className="flex items-center gap-3">
            <FileIcon kind={doc.kind} />
            <div className="min-w-0">
              <p className="truncate text-[14.5px] font-medium">{docTitle(doc)}</p>
              <p className="text-[12.5px] text-muted">{pack.pages} pages</p>
            </div>
          </div>
          <Badge className="mt-5">{pack.subject}</Badge>
          <h2 className="mt-5 text-[15px] font-medium">Summary</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">{pack.summary}</p>
          <h2 className="mt-6 text-[15px] font-medium">Key points</h2>
          <ul className="mt-3 grid gap-3">
            {pack.keyPoints.map((k) => (
              <li key={k} className="flex gap-2.5 text-[14px] leading-snug text-soft">
                <span aria-hidden className="round mt-1.5 size-1.5 shrink-0 rounded-full bg-leaf" />
                {k}
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-2">
            <ButtonLink href={`/app/flashcards?doc=${doc.id}`} variant="glass" icon={<Layers className="size-4" />}>
              {pack.cards.length} flashcards
            </ButtonLink>
            <ButtonLink href={`/app/quiz?doc=${doc.id}`} variant="glass" icon={<ListChecks className="size-4" />}>
              {pack.quiz.length}-question quiz
            </ButtonLink>
          </div>
        </aside>
      </div>
    </div>
  )
}
