/** POST JSON to a Worker route. Resolves `{ ok, data }` and never throws. */
export async function postJson<T = Record<string, unknown>>(
  url: string,
  payload: unknown,
): Promise<{ ok: true; data: T } | { ok: false; error: string; errors?: Record<string, string> }> {
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) })
    const data = (await res.json().catch(() => ({}))) as T & { error?: string; errors?: Record<string, string> }
    if (!res.ok) return { ok: false, error: data.error ?? 'Something went wrong. Try again.', errors: data.errors }
    return { ok: true, data }
  } catch {
    return { ok: false, error: 'You appear to be offline. Check your connection and try again.' }
  }
}
