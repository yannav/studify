import { isPack } from '../shared/packs'
import { KEYS, SEED_ATTEMPTS, SEED_DOCS } from './library'
import type { Attempt, CardState, ChatMessage, Doc, DocKind, User } from './library'
import { readStore, writeStore } from './storage'

/*
  One JSON file with everything the app remembers. localStorage is the only
  copy of a student's library, so this is the way to move it to another
  browser or keep it before clearing site data.

  Imported files are untrusted: every field is checked here before anything is
  written, and a file that fails the check changes nothing.
*/

export const BACKUP_VERSION = 1

export type BackupData = {
  docs: Doc[]
  cards: Record<string, CardState>
  attempts: Attempt[]
  chats: Record<string, ChatMessage[]>
  user: User | null
  days: string[]
}

export type Backup = { app: 'studify'; version: number; exportedAt: string; data: BackupData }

export const NOT_BACKUP = 'That file isn’t a Studify backup. Choose the .json file you exported from this app.'
export const NEWER_BACKUP = 'That backup was made by a newer version of Studify, so it can’t be restored here.'
export const DAMAGED_BACKUP = 'That backup is damaged, so nothing was restored. Try another file.'

const KINDS: DocKind[] = ['pdf', 'doc', 'png', 'txt', 'ppt']

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)
const isString = (v: unknown): v is string => typeof v === 'string'
const isNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

function validDoc(v: unknown): Doc | null {
  if (!isObject(v)) return null
  const { id, name, kind, size, addedAt } = v
  if (!isString(id) || !id || !isString(name) || !isString(addedAt)) return null
  if (!isString(kind) || !KINDS.includes(kind as DocKind)) return null
  if (!isNumber(size) || size < 0) return null
  if (v.packId !== undefined && !isString(v.packId)) return null
  if (v.pack !== undefined && !isPack(v.pack)) return null
  return {
    id,
    name,
    kind: kind as DocKind,
    size,
    addedAt,
    ...(isString(v.packId) ? { packId: v.packId } : {}),
    ...(isPack(v.pack) ? { pack: v.pack } : {}),
  }
}

function validCards(v: unknown): Record<string, CardState> | null {
  if (!isObject(v)) return null
  const out: Record<string, CardState> = {}
  for (const [key, state] of Object.entries(v)) {
    if (!isObject(state) || !isNumber(state.box) || !isNumber(state.due) || !isNumber(state.reviews)) return null
    out[key] = { box: state.box, due: state.due, reviews: state.reviews }
  }
  return out
}

function validMessages(v: unknown): ChatMessage[] | null {
  if (!Array.isArray(v)) return null
  const out: ChatMessage[] = []
  for (const m of v) {
    if (!isObject(m) || !isString(m.id) || !isString(m.text)) return null
    if (m.from !== 'you' && m.from !== 'studify') return null
    if (m.cite !== undefined && m.cite !== null && !isString(m.cite)) return null
    if (m.error !== undefined && typeof m.error !== 'boolean') return null
    out.push({
      id: m.id,
      from: m.from,
      text: m.text,
      ...(m.cite !== undefined ? { cite: m.cite as string | null } : {}),
      ...(m.error ? { error: true } : {}),
    })
  }
  return out
}

function validChats(v: unknown): Record<string, ChatMessage[]> | null {
  if (!isObject(v)) return null
  const out: Record<string, ChatMessage[]> = {}
  for (const [docId, messages] of Object.entries(v)) {
    const list = validMessages(messages)
    if (!list) return null
    out[docId] = list
  }
  return out
}

function validAttempts(v: unknown): Attempt[] | null {
  if (!Array.isArray(v)) return null
  const out: Attempt[] = []
  for (const a of v) {
    if (!isObject(a) || !isString(a.docId) || !isString(a.at)) return null
    if (!isNumber(a.score) || !isNumber(a.total) || a.total <= 0) return null
    out.push({ docId: a.docId, score: a.score, total: a.total, at: a.at })
  }
  return out
}

function validUser(v: unknown): User | null | undefined {
  if (v === null) return null
  if (!isObject(v) || !isString(v.name) || !isString(v.email) || !isString(v.level)) return undefined
  return { name: v.name, email: v.email, level: v.level }
}

/** The current library as a downloadable JSON string. */
export function exportBackup(): string {
  const data: BackupData = {
    docs: readStore<Doc[]>(KEYS.docs, SEED_DOCS),
    cards: readStore<Record<string, CardState>>(KEYS.cards, {}),
    attempts: readStore<Attempt[]>(KEYS.attempts, SEED_ATTEMPTS),
    chats: readStore<Record<string, ChatMessage[]>>(KEYS.chats, {}),
    user: readStore<User | null>(KEYS.user, null),
    days: readStore<string[]>(KEYS.days, []),
  }
  const backup: Backup = { app: 'studify', version: BACKUP_VERSION, exportedAt: new Date().toISOString(), data }
  return JSON.stringify(backup, null, 2)
}

/** "studify-backup-2026-11-18.json" */
export function backupFileName(date = new Date()) {
  return `studify-backup-${date.toISOString().slice(0, 10)}.json`
}

export type ParseResult = { ok: true; backup: Backup } | { ok: false; error: string }

/** Check a backup file's text; returns the sanitised backup or a user-facing message. */
export function parseBackup(text: string): ParseResult {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return { ok: false, error: NOT_BACKUP }
  }
  if (!isObject(raw) || raw.app !== 'studify' || !isObject(raw.data)) return { ok: false, error: NOT_BACKUP }
  if (!isNumber(raw.version) || raw.version < 1) return { ok: false, error: NOT_BACKUP }
  if (raw.version > BACKUP_VERSION) return { ok: false, error: NEWER_BACKUP }

  const d = raw.data
  const docs = Array.isArray(d.docs) ? d.docs.map(validDoc) : null
  if (!docs || docs.some((x) => x === null)) return { ok: false, error: DAMAGED_BACKUP }
  const cards = d.cards === undefined ? {} : validCards(d.cards)
  const attempts = d.attempts === undefined ? [] : validAttempts(d.attempts)
  const chats = d.chats === undefined ? {} : validChats(d.chats)
  const days = d.days === undefined ? [] : Array.isArray(d.days) && d.days.every(isString) ? d.days : null
  const user = d.user === undefined ? null : validUser(d.user)
  if (!cards || !attempts || !chats || !days || user === undefined) return { ok: false, error: DAMAGED_BACKUP }

  return {
    ok: true,
    backup: {
      app: 'studify',
      version: raw.version,
      exportedAt: isString(raw.exportedAt) ? raw.exportedAt : new Date().toISOString(),
      data: { docs: docs as Doc[], cards, attempts, chats, user, days },
    },
  }
}

/** Replace everything the app remembers with this backup. */
export function restoreBackup(backup: Backup) {
  writeStore(KEYS.docs, backup.data.docs)
  writeStore(KEYS.cards, backup.data.cards)
  writeStore(KEYS.attempts, backup.data.attempts)
  writeStore(KEYS.chats, backup.data.chats)
  writeStore(KEYS.user, backup.data.user)
  writeStore(KEYS.days, backup.data.days)
}

/** What the student is about to restore, for the confirmation line. */
export function backupCounts(backup: Backup) {
  return {
    docs: backup.data.docs.length,
    cards: Object.keys(backup.data.cards).length,
    messages: Object.values(backup.data.chats).reduce((n, list) => n + list.length, 0),
  }
}
