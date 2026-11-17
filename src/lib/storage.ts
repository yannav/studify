import { useCallback, useEffect, useState } from 'react'

/*
  localStorage with a namespace, JSON and graceful failure (private windows,
  blocked storage). Everything the app remembers goes through here. An
  in-memory copy is the source of truth while the page is open, so the app
  still works when storage is unavailable; every hook reading a key re-renders
  when any component writes it.
*/
const NS = 'cramly:'
const EVENT = 'cramly:store'
const mem = new Map<string, unknown>()

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
  try {
    if (value === undefined) window.localStorage.removeItem(NS + key)
    else window.localStorage.setItem(NS + key, JSON.stringify(value))
  } catch {
    /* storage unavailable: keep working in memory */
  }
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
