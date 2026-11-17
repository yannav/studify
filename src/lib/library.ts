import { useCallback } from 'react'

import { PACK_BY_ID } from '../shared/packs'
import type { Pack } from '../shared/packs'
import { readStore, useStored, writeStore } from './storage'

/*
  The demo app's state, all in localStorage (see storage.ts): the library of
  uploaded documents, flashcard progress, quiz attempts, chat threads, the
  signed-in user and the days you studied. Clear site data to start over, or
  use "Reset demo data" in the account menu.
*/

export type DocKind = 'pdf' | 'doc' | 'png' | 'txt' | 'ppt'
export type Doc = { id: string; name: string; kind: DocKind; size: number; packId: string; addedAt: string }
export type ChatMessage = { id: string; from: 'you' | 'cramly'; text: string; cite?: string | null; error?: boolean }
export type CardState = { box: number; due: number; reviews: number }
export type Attempt = { docId: string; score: number; total: number; at: string }
export type User = { name: string; email: string; level: string }

export const SEED_DOCS: Doc[] = [
  { id: 'seed-bio', name: 'BIO 201 Cell division.pdf', kind: 'pdf', size: 4_830_000, packId: 'cell-division', addedAt: '2026-11-09T18:20:00.000Z' },
  { id: 'seed-hist', name: 'French Revolution essay notes.docx', kind: 'doc', size: 612_000, packId: 'french-revolution', addedAt: '2026-11-07T09:05:00.000Z' },
  { id: 'seed-calc', name: 'Calc lecture 4 whiteboard.png', kind: 'png', size: 2_140_000, packId: 'derivatives', addedAt: '2026-11-04T15:42:00.000Z' },
]

const SEED_ATTEMPTS: Attempt[] = [
  { docId: 'seed-hist', score: 4, total: 5, at: '2026-11-08T20:10:00.000Z' },
  { docId: 'seed-calc', score: 3, total: 5, at: '2026-11-06T19:00:00.000Z' },
]

const KEYS = { docs: 'docs', cards: 'cards', attempts: 'attempts', chats: 'chats', user: 'user', days: 'days' }

export function packOf(doc: Doc): Pack {
  return PACK_BY_ID[doc.packId] ?? PACK_BY_ID['cell-division']
}

/** "BIO 201 Cell division.pdf" → "BIO 201 Cell division" */
export function docTitle(doc: Doc) {
  return doc.name.replace(/\.[a-z0-9]+$/i, '')
}

export function useDocs() {
  return useStored<Doc[]>(KEYS.docs, SEED_DOCS)
}
export function useUser() {
  return useStored<User | null>(KEYS.user, null)
}
export function useAttempts() {
  return useStored<Attempt[]>(KEYS.attempts, SEED_ATTEMPTS)
}
export function useCardStates() {
  return useStored<Record<string, CardState>>(KEYS.cards, {})
}
export function useChats() {
  return useStored<Record<string, ChatMessage[]>>(KEYS.chats, {})
}
export function useDays() {
  return useStored<string[]>(KEYS.days, [])
}

export function today(d = new Date()) {
  return d.toISOString().slice(0, 10)
}

/** Record that the student studied today (feeds the streak). */
export function markStudied() {
  const days = readStore<string[]>(KEYS.days, [])
  const t = today()
  if (!days.includes(t)) writeStore(KEYS.days, [...days, t].slice(-120))
}

export function streak(days: string[]) {
  const set = new Set(days)
  let n = 0
  const d = new Date()
  if (!set.has(today(d))) d.setUTCDate(d.getUTCDate() - 1)
  while (set.has(today(d))) {
    n++
    d.setUTCDate(d.getUTCDate() - 1)
  }
  return n
}

const DAY = 86_400_000
const INTERVALS = [0, 1, 3, 7, 16, 35]

export type Grade = 'again' | 'hard' | 'good' | 'easy'

export function nextState(prev: CardState | undefined, grade: Grade, now = Date.now()): CardState {
  const box = prev?.box ?? 0
  const next = grade === 'again' ? 0 : grade === 'hard' ? Math.max(1, box) : grade === 'good' ? box + 1 : box + 2
  const b = Math.min(next, INTERVALS.length - 1)
  return { box: b, due: grade === 'again' ? now : now + INTERVALS[b] * DAY, reviews: (prev?.reviews ?? 0) + 1 }
}

export const cardKey = (docId: string, cardId: string) => `${docId}:${cardId}`

export function dueCount(docs: Doc[], states: Record<string, CardState>, now = Date.now()) {
  return docs.reduce((n, d) => n + packOf(d).cards.filter((c) => (states[cardKey(d.id, c.id)]?.due ?? 0) <= now).length, 0)
}

export function useLibraryActions() {
  const [, setDocs] = useDocs()
  const [, setChats] = useChats()
  const [, setStates] = useCardStates()
  const [, setAttempts] = useAttempts()
  const add = useCallback((doc: Doc) => setDocs((d) => [doc, ...d.filter((x) => x.id !== doc.id)]), [setDocs])
  const remove = useCallback(
    (id: string) => {
      setDocs((d) => d.filter((x) => x.id !== id))
      setChats((c) => {
        const { [id]: _drop, ...rest } = c
        void _drop
        return rest
      })
      setStates((s) => Object.fromEntries(Object.entries(s).filter(([k]) => !k.startsWith(id + ':'))))
      setAttempts((a) => a.filter((x) => x.docId !== id))
    },
    [setDocs, setChats, setStates, setAttempts],
  )
  return { add, remove }
}

export function resetDemo() {
  for (const k of Object.values(KEYS)) writeStore(k, undefined)
}
