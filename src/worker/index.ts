import { Hono } from 'hono'

import { buildPack } from '../shared/analyze'
import { answer, isPack } from '../shared/packs'
import { fileKind, validateContact, validateEmail, validateLogin, validateQuestion, validateSignup, validateText, validateUpload } from '../shared/validate'

/*
  The Worker in front of the static site. Every form posts here and gets the
  same validation the browser runs (src/shared/validate.ts). Nothing is stored
  server-side: the app keeps its library in localStorage. Wire these routes to
  your auth provider, a D1 table or a model when you outgrow the demo.
*/
type Env = { ASSETS: Fetcher }

const app = new Hono<{ Bindings: Env }>()

async function body<T>(c: { req: { json: <J>() => Promise<J> } }): Promise<Partial<T> | null> {
  try {
    const v = await c.req.json<unknown>()
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Partial<T>) : null
  } catch {
    return null
  }
}

const invalidJson = { error: 'Send a JSON object.' }
const fields = 'Check the highlighted fields.'

app.get('/api/health', (c) => c.json({ ok: true }))

app.post('/api/signup', async (c) => {
  const b = await body<Record<string, unknown>>(c)
  if (!b) return c.json(invalidJson, 400)
  const errors = validateSignup(b)
  if (Object.keys(errors).length) return c.json({ error: fields, errors }, 422)
  return c.json({ ok: true, user: { name: String(b.name).trim(), email: String(b.email).trim().toLowerCase(), level: b.level } })
})

// Demo sign-in: validates the shape only. Replace with your auth provider.
app.post('/api/login', async (c) => {
  const b = await body<Record<string, unknown>>(c)
  if (!b) return c.json(invalidJson, 400)
  const errors = validateLogin(b)
  if (Object.keys(errors).length) return c.json({ error: fields, errors }, 422)
  const email = String(b.email).trim().toLowerCase()
  const name = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
  return c.json({ ok: true, user: { name, email, level: 'University' } })
})

app.post('/api/subscribe', async (c) => {
  const b = await body<{ email: string }>(c)
  if (!b) return c.json(invalidJson, 400)
  const error = validateEmail(b.email)
  if (error) return c.json({ error, errors: { email: error } }, 422)
  return c.json({ ok: true })
})

app.post('/api/contact', async (c) => {
  const b = await body<Record<string, unknown>>(c)
  if (!b) return c.json(invalidJson, 400)
  const errors = validateContact(b)
  if (Object.keys(errors).length) return c.json({ error: fields, errors }, 422)
  return c.json({ ok: true })
})

// Analyse an upload: the browser sends the text it read from the file, and the
// pack is built from that text. Nothing is stored server-side.
app.post('/api/upload', async (c) => {
  const b = await body<{ name: string; size: number; text: string }>(c)
  if (!b) return c.json(invalidJson, 400)
  const error = validateUpload(b)
  if (error) return c.json({ error }, 422)
  const textError = validateText(b.text)
  if (textError) return c.json({ error: textError }, 422)
  const name = String(b.name).trim()
  return c.json({
    ok: true,
    document: {
      id: crypto.randomUUID(),
      name,
      kind: fileKind(name),
      size: b.size,
      pack: buildPack(String(b.text), name),
      addedAt: new Date().toISOString(),
    },
  })
})

// The tutor answers from the document's pack, which the client sends with the
// question (packs live in the browser's library). Swap `answer` for a model call
// to make it real.
app.post('/api/chat', async (c) => {
  const b = await body<{ pack: unknown; message: string }>(c)
  if (!b) return c.json(invalidJson, 400)
  if (!isPack(b.pack)) return c.json({ error: 'That document is no longer in your library.' }, 404)
  const error = validateQuestion(b.message)
  if (error) return c.json({ error }, 422)
  return c.json({ ok: true, reply: answer(b.pack, String(b.message)) })
})

app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404))

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
