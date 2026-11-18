/*
  One-time storage migration from the app's previous name.

  The rename moved every localStorage key from `cramly:` to `studify:`, and the
  saved language from `studify:locale`'s old key. Without this, a returning
  visitor silently loses their library, streak and language choice.

  Copy each `cramly:` value to its `studify:` counterpart once, then leave the
  old keys untouched: the app never writes or deletes them, so nothing is lost
  and a rollback still works.

  The flag is claimed *before* anything is copied. That ordering is the whole
  safety story: "Reset everything" deletes the new keys, and if a later load
  re-ran the copy it would pull the deleted data back out of the old keys. Once
  the flag is set, no load ever copies again.
*/
const LEGACY_NS = 'cramly:'
const NS = 'studify:' // must match NS in ./storage
const FLAG = 'studify:legacy-migrated'

export function migrateLegacyStorage() {
  try {
    const ls = window.localStorage
    if (ls.getItem(FLAG) !== null) return
    ls.setItem(FLAG, '1') // claim it first: a failed copy must not retry later
    // Collect first, then copy: writing inside the index loop would shift it.
    const legacy: string[] = []
    for (let i = 0; i < ls.length; i++) {
      const k = ls.key(i)
      if (k?.startsWith(LEGACY_NS)) legacy.push(k)
    }
    for (const k of legacy) {
      const target = NS + k.slice(LEGACY_NS.length)
      const raw = ls.getItem(k)
      if (raw !== null && ls.getItem(target) === null) ls.setItem(target, raw) // raw copy: JSON values and the plain locale string alike
    }
  } catch {
    /* storage unavailable (private window, blocked, full): nothing to migrate */
  }
}
