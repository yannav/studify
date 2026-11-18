import { useCallback, useEffect, useMemo, useState } from 'react'
import { PartyPopper, RotateCw, Shuffle } from 'lucide-react'

import { Button, ButtonLink, IconButton } from '../../components/Button'
import { EmptyState } from '../../components/EmptyState'
import { ProgressBar } from '../../components/Progress'
import { Segmented } from '../../components/Segmented'
import { useT } from '../../lib/i18n'
import { cardKey, markStudied, nextState, packOf, useCardStates } from '../../lib/library'
import type { Grade } from '../../lib/library'
import type { Card } from '../../shared/packs'
import { AppHeader } from './AppHeader'
import { DocPicker } from './DocPicker'
import { NoDocs } from './NoDocs'
import { useActiveDoc } from './useActiveDoc'

const GRADES: { grade: Grade; label: string; key: string; hint: string; variant: 'danger' | 'glass' | 'tint' | 'leaf' }[] = [
  { grade: 'again', label: 'Again', key: '1', hint: 'now', variant: 'danger' },
  { grade: 'hard', label: 'Hard', key: '2', hint: '1 day', variant: 'glass' },
  { grade: 'good', label: 'Good', key: '3', hint: 'few days', variant: 'tint' },
  { grade: 'easy', label: 'Easy', key: '4', hint: 'a week+', variant: 'leaf' },
]

/** Spaced-repetition review. Progress per card is saved, so due cards survive a reload. */
export function FlashcardsPage() {
  const t = useT()
  const [doc, docs, pick] = useActiveDoc()
  const [states, setStates] = useCardStates()
  const [mode, setMode] = useState<'due' | 'all'>('due')
  const [queue, setQueue] = useState<Card[]>([])
  const [done, setDone] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [session, setSession] = useState(0)

  const pack = doc ? packOf(doc) : null
  const dueCards = useMemo(() => (doc && pack ? pack.cards.filter((c) => (states[cardKey(doc.id, c.id)]?.due ?? 0) <= Date.now()) : []), [doc, pack, states])

  // Build the queue when the document, mode or session changes (not on every grade).
  useEffect(() => {
    if (!doc || !pack) return
    setQueue(mode === 'all' ? pack.cards : dueCards)
    setDone(0)
    setFlipped(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc?.id, mode, session])

  const card = queue[0]
  const total = done + queue.length

  const grade = useCallback(
    (g: Grade) => {
      if (!doc || !card) return
      setStates((s) => ({ ...s, [cardKey(doc.id, card.id)]: nextState(s[cardKey(doc.id, card.id)], g) }))
      markStudied()
      setFlipped(false)
      if (g === 'again') setQueue((q) => [...q.slice(1), q[0]])
      else {
        setQueue((q) => q.slice(1))
        setDone((d) => d + 1)
      }
    },
    [doc, card, setStates],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, select, [role="dialog"]')) return
      if (!card) return
      if ((e.key === ' ' || e.key === 'Enter') && t.id !== 'flashcard' && !t.closest('button, a')) {
        e.preventDefault()
        setFlipped((f) => !f)
      }
      const g = GRADES.find((x) => x.key === e.key)
      if (g && flipped) grade(g.grade)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [card, flipped, grade])

  if (!doc || !pack) return <NoDocs what="a flashcard deck" />

  return (
    <>
      <AppHeader title={t('Flashcards')} lede={t('{n} cards from {title}. {due} due now.', { n: pack.cards.length, title: pack.title, due: dueCards.length })}>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <DocPicker doc={doc} docs={docs} onChange={pick} />
          <Segmented label={t('Cards to review')} value={mode} onChange={setMode} options={[{ value: 'due', label: t('Due') }, { value: 'all', label: t('All') }]} />
        </div>
      </AppHeader>

      <div className="mx-auto grid max-w-3xl gap-6 px-5 py-8 sm:px-8 lg:py-12">
        {card ? (
          <>
            <div className="flex items-center gap-4">
              <ProgressBar label={t('Deck progress')} value={done} max={total} className="flex-1" />
              <span className="text-[13.5px] tabular-nums text-muted">
                {t('{done} of {total}', { done, total })}
              </span>
              <IconButton
                label={t('Shuffle remaining cards')}
                size="sm"
                onClick={() => {
                  setQueue((q) => [...q].sort(() => Math.random() - 0.5))
                  setFlipped(false)
                }}
              >
                <Shuffle className="size-4" />
              </IconButton>
            </div>

            <div className="[perspective:1600px]">
              <button
                id="flashcard"
                type="button"
                onClick={() => setFlipped((f) => !f)}
                data-flipped={flipped}
                className="flip relative grid h-[min(56vh,380px)] w-full cursor-pointer rounded-[32px] text-left"
              >
                <span aria-hidden={flipped} className="flip-face glass absolute inset-0 flex flex-col rounded-[32px] p-7 sm:p-10">
                  <span className="text-[13px] text-leaf-text">{t('Question')}</span>
                  <span className="my-auto text-[clamp(24px,3.2vw,36px)] font-normal leading-tight tracking-[-0.035em]">{card.front}</span>
                  <span className="flex items-center gap-2 text-[13px] text-faint">
                    <RotateCw aria-hidden className="size-3.5" /> {t('Tap or press Space to flip')}
                  </span>
                </span>
                <span aria-hidden={!flipped} className="flip-face flip-back absolute inset-0 flex flex-col rounded-[32px] border border-leaf/30 bg-gradient-to-br from-leaf-deep/70 to-panel p-7 shadow-float sm:p-10">
                  <span className="text-[13px] text-leaf-text">{t('Answer')}</span>
                  <span className="my-auto text-[clamp(22px,2.8vw,32px)] font-normal leading-snug tracking-[-0.03em]">{card.back}</span>
                  <span className="text-[13px] text-faint">{card.front}</span>
                </span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-hidden={!flipped}>
              {GRADES.map((g) => (
                <Button key={g.grade} variant={g.variant} size="lg" className="h-16 flex-col !gap-0.5" disabled={!flipped} onClick={() => grade(g.grade)}>
                  <span>{t(g.label)}</span>
                  <span className="text-[12px] font-normal opacity-75">
                    {t(g.hint)}
                  </span>
                </Button>
              ))}
            </div>
            <p className="hidden items-center justify-center gap-2 text-[13px] text-faint sm:flex">
              {t('Grade with 1 2 3 4 once the answer shows')}
            </p>
          </>
        ) : (
          <EmptyState
            icon={<PartyPopper className="size-6" />}
            title={done ? t('Deck finished') : t('All caught up')}
            body={done ? `You reviewed ${done} card${done === 1 ? '' : 's'}. Studify will bring each one back just before you forget it.` : 'No cards are due in this file right now. Review the whole deck anyway, or test yourself with the quiz.'}
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  variant="glass"
                  onClick={() => {
                    setMode('all')
                    setSession((s) => s + 1)
                  }}
                >
                  {t('Review all cards')}
                </Button>
                <ButtonLink href={`/app/quiz?doc=${doc.id}`} variant="paper">
                  {t('Take the quiz')}
                </ButtonLink>
              </div>
            }
          />
        )}
      </div>
    </>
  )
}
