import { useState } from 'react'
import type { FormEvent } from 'react'

import { postJson } from '../lib/api'
import { validateEmail } from '../shared/validate'
import { Button } from './Button'
import { Notice } from './Notice'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    const err = validateEmail(email)
    if (err) return setError(err)
    setBusy(true)
    const res = await postJson('/api/subscribe', { email })
    setBusy(false)
    if (!res.ok) return setError(res.errors?.email ?? res.error)
    setDone(true)
  }

  if (done) return <Notice tone="success">You are on the list. The first tip lands next week.</Notice>
  return (
    <form onSubmit={submit} noValidate className="grid gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="nl-email" className="sr-only">
          Email address
        </label>
        <input
          id="nl-email"
          type="email"
          autoComplete="email"
          placeholder="you@school.edu"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError(null)
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'nl-err' : undefined}
          className="field h-12 w-full sm:flex-1"
        />
        <Button type="submit" variant="leaf" size="md" className="h-12" loading={busy}>
          Subscribe
        </Button>
      </div>
      {error && (
        <p id="nl-err" className="text-[13px] text-danger">
          {error}
        </p>
      )}
    </form>
  )
}
