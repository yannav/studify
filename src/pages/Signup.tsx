import { useState } from 'react'
import type { FormEvent } from 'react'

import { AuthShell } from '../components/AuthShell'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Checkbox, Input, Select } from '../components/Field'
import { Notice } from '../components/Notice'
import { AUTH, PLANS } from '../content'
import { postJson } from '../lib/api'
import { useT } from '../lib/i18n'
import { useUser } from '../lib/library'
import type { User } from '../lib/library'
import { Link, navigate, useLocation } from '../lib/router'
import type { Errors } from '../shared/validate'
import { LEVELS, validateSignup } from '../shared/validate'

export function Signup() {
  const t = useT()
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
      title={t(AUTH.signupTitle)}
      lede={t(AUTH.signupLede)}
      footer={
        <>
          {t('Already have an account?')}{' '}
          <Link href="/login" className="inline-flex min-h-10 items-center text-leaf-text underline underline-offset-4">
            {t('Log in')}
          </Link>
        </>
      }
    >
      {plan && plan.id !== 'free' && (
        <Badge tone="leaf" className="mb-6">
          {t(plan.name)}: 7 days free
        </Badge>
      )}
      <form onSubmit={submit} noValidate className="grid gap-5">
        <Input id="su-name" label={t('Name')} autoComplete="name" value={v.name} onChange={(e) => set('name', e.target.value)} error={errors.name ? t(errors.name) : undefined} />
        <Input id="su-email" label={t('Email')} type="email" autoComplete="email" value={v.email} onChange={(e) => set('email', e.target.value)} error={errors.email ? t(errors.email) : undefined} />
        <Input id="su-password" label={t('Password')} type="password" autoComplete="new-password" value={v.password} onChange={(e) => set('password', e.target.value)} error={errors.password ? t(errors.password) : undefined} hint={t('8 or more characters, with a number.')} />
        <Select id="su-level" label={t('Where do you study?')} value={v.level} onChange={(e) => set('level', e.target.value)} error={errors.level ? t(errors.level) : undefined}>
          <option value="" disabled>
            {t('Choose one')}
          </option>
          {LEVELS.map((l) => (
            <option key={l}>{t(l)}</option>
          ))}
        </Select>
        <Checkbox id="su-terms" checked={v.terms} onChange={(e) => set('terms', e.target.checked)} error={errors.terms ? t(errors.terms) : undefined} label={t('I agree to the terms and privacy policy.')} />
        {failure && <Notice tone="error">{t(failure)}</Notice>}
        <Button type="submit" variant="paper" size="lg" block loading={busy}>
          {t('Create account')}
        </Button>
      </form>
    </AuthShell>
  )
}
