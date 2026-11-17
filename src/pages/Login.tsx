import { useState } from 'react'
import type { FormEvent } from 'react'

import { AuthShell } from '../components/AuthShell'
import { Button } from '../components/Button'
import { Input } from '../components/Field'
import { Notice } from '../components/Notice'
import { AUTH } from '../content'
import { postJson } from '../lib/api'
import { useUser } from '../lib/library'
import type { User } from '../lib/library'
import { Link, navigate } from '../lib/router'
import type { Errors } from '../shared/validate'
import { validateLogin } from '../shared/validate'

export function Login() {
  const [, setUser] = useUser()
  const [v, setV] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [failure, setFailure] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    const errs = validateLogin(v)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    setFailure('')
    const res = await postJson<{ user: User }>('/api/login', v)
    setBusy(false)
    if (!res.ok) {
      setErrors(res.errors ?? {})
      return setFailure(res.error)
    }
    setUser(res.data.user)
    navigate('/app')
  }

  return (
    <AuthShell
      title={AUTH.loginTitle}
      lede={AUTH.loginLede}
      footer={
        <>
          New to Cramly?{' '}
          <Link href="/signup" className="inline-flex min-h-10 items-center text-leaf-text underline underline-offset-4">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="grid gap-5">
        <Input label="Email" type="email" autoComplete="email" value={v.email} onChange={(e) => (setV({ ...v, email: e.target.value }), setErrors({ ...errors, email: '' }))} error={errors.email} />
        <Input label="Password" type="password" autoComplete="current-password" value={v.password} onChange={(e) => (setV({ ...v, password: e.target.value }), setErrors({ ...errors, password: '' }))} error={errors.password} hint="Demo: any email and password sign you in." />
        {failure && <Notice tone="error">{failure}</Notice>}
        <Button type="submit" variant="paper" size="lg" block loading={busy}>
          Log in
        </Button>
      </form>
    </AuthShell>
  )
}
