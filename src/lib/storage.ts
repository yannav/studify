import { useCallback, useEffect, useState } from 'react'

import { migrateLegacyStorage } from './legacy'

/*
  localStorage with a namespace, JSON and graceful failure (private windows,
  blocked storage). Everything the app remembers goes through here. An
  in-memory copy is the source of truth while the page is open, so the app
  still works when storage is unavailable; every hook reading a key re-renders
  when any component writes it.

  A failed write is never silent: it is kept in `lastStorageFailure` and
  announced on `studify:storage-failed`, so the app can tell the student their
  library is not being saved (full storage, private mode).
*/
const NS = 'studify:'
const EVENT = 'studify:store'
const FAIL_EVENT = 'studify:storage-failed'
const mem = new Map<string, unknown>()

export type StorageFailure = { key: string; quota: boolean }

let lastFailure: StorageFailure | null = null

// Before anything reads: carry over data saved under the app's previous name.
migrateLegacyStorage()

function isQuotaError(e: unknown) {
  return e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22 || e.code === 1014)
}

/** The most recent write that could not be saved, or null if the last write worked. */
export function lastStorageFailure() {
  return lastFailure
}

/** Listen for writes the browser refused (storage full, or saving blocked). */
export function onStorageFailure(cb: (failure: StorageFailure) => void) {
  const handler = (e: Event) => cb((e as CustomEvent<StorageFailure>).detail)
  window.addEventListener(FAIL_EVENT, handler)
  return () => window.removeEventListener(FAIL_EVENT, handler)
}

export function readStore<T>(key: string, fallback: T): T {
  if (mem.has(key)) return mem.get(key) as T
  try {
    const raw = window.localStorage.getItem(NS + key)
    if (raw === null) return fallback
    const v = JSON.parse(raw) as T
    mem.set(key, v)
    return v
  } catch {
    return fallback
  }
}

export function writeStore<T>(key: string, value: T) {
  if (value === undefined) mem.delete(key)
  else mem.set(key, value)
  let failure: StorageFailure | null = null
  try {
    if (value === undefined) window.localStorage.removeItem(NS + key)
    else window.localStorage.setItem(NS + key, JSON.stringify(value))
  } catch (e) {
    /* storage unavailable: keep working in memory, but say so */
    failure = { key, quota: isQuotaError(e) }
  }
  lastFailure = failure
  if (failure) window.dispatchEvent(new CustomEvent<StorageFailure>(FAIL_EVENT, { detail: failure }))
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }))
}

/** useState that persists to localStorage and stays in sync between components. */
export function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStore(key, fallback))
  useEffect(() => {
    const sync = (e: Event) => {
      if (e.type === 'storage') {
        if ((e as StorageEvent).key !== NS + key) return
        mem.delete(key)
      } else if ((e as CustomEvent).detail !== key) return
      setValue(readStore(key, fallback))
    }
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  // Writes happen outside React's updater functions: read the latest value,
  // compute, persist, then notify every subscriber (this one included).
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = readStore(key, fallback)
      const v = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
      writeStore(key, v)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  )
  return [value, set] as const
}
