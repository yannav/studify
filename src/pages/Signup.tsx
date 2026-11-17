import { useState } from 'react'
import type { FormEvent } from 'react'

import { AuthShell } from '../components/AuthShell'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Checkbox, Input, Select } from '../components/Field'
import { Notice } from '../components/Notice'
import { AUTH, PLANS } from '../content'
import { postJson } from '../lib/api'
import { useUser } from '../lib/library'
import type { User } from '../lib/library'
import { Link, navigate, useLocation } from '../lib/router'
import type { Errors } from '../shared/validate'
import { LEVELS, validateSignup } from '../shared/validate'

export function Signup() {
  const { search } = useLocation()
  const plan = PLANS.find((p) => p.id === new URLSearchParams(search).get('plan'))
  const [, setUser] = useUser()
  const [v, setV] = useState({ name: '', email: '', password: '', level: '', terms: false })
  const [errors, setErrors] = useState<Errors>({})
  const [failure, setFailure] = useState('')
  const [busy, setBusy] = useState(false)
  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => {
    setV({ ...v, [k]: val })
    setErrors({ ...errors, [k]: '' })
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    const errs = validateSignup(v)
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.getElementById(`su-${Object.keys(errs)[0]}`)?.focus()
      return
    }
    setBusy(true)
    setFailure('')
    const res = await postJson<{ user: User }>('/api/signup', v)
    setBusy(false)
    if (!res.ok) {
      setErrors(res.errors ?? {})
      return setFailure(res.error)
    }
    setUser(res.data.user)
    navigate('/app?welcome=1')
  }

  return (
    <AuthShell
      title={AUTH.signupTitle}
      lede={AUTH.signupLede}
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="inline-flex min-h-10 items-center text-leaf-text underline underline-offset-4">
            Log in
          </Link>
        </>
      }
    >
      {plan && plan.id !== 'free' && <Badge tone="leaf" className="mb-6">{plan.name} plan, 7 days free</Badge>}
      <form onSubmit={submit} noValidate className="grid gap-5">
        <Input id="su-name" label="Name" autoComplete="name" value={v.name} onChange={(e) => set('name', e.target.value)} error={errors.name} />
        <Input id="su-email" label="Email" type="email" autoComplete="email" value={v.email} onChange={(e) => set('email', e.target.value)} error={errors.email} />
        <Input id="su-password" label="Password" type="password" autoComplete="new-password" value={v.password} onChange={(e) => set('password', e.target.value)} error={errors.password} hint="8 or more characters, with a number." />
        <Select id="su-level" label="Where do you study?" value={v.level} onChange={(e) => set('level', e.target.value)} error={errors.level}>
          <option value="" disabled>
            Choose one
          </option>
          {LEVELS.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </Select>
        <Checkbox id="su-terms" checked={v.terms} onChange={(e) => set('terms', e.target.checked)} error={errors.terms} label="I agree to the terms and privacy policy." />
        {failure && <Notice tone="error">{failure}</Notice>}
        <Button type="submit" variant="paper" size="lg" block loading={busy}>
          Create account
        </Button>
      </form>
    </AuthShell>
  )
}
