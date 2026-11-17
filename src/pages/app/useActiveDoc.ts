import { useDocs } from '../../lib/library'
import type { Doc } from '../../lib/library'
import { navigate, useLocation } from '../../lib/router'

/** The document named by `?doc=`, else the newest one. */
export function useActiveDoc(): [Doc | null, Doc[], (id: string) => void] {
  const { path, search } = useLocation()
  const [docs] = useDocs()
  const id = new URLSearchParams(search).get('doc')
  const doc = docs.find((d) => d.id === id) ?? docs[0] ?? null
  return [doc, docs, (next: string) => navigate(`${path}?doc=${encodeURIComponent(next)}`, { replace: true })]
}
