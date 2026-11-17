import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { Input, Textarea } from '../components/Field'
import { Notice } from '../components/Notice'
import { PageIntro } from '../components/PageIntro'
import { Photo } from '../components/Photo'
import { Reveal } from '../components/Reveal'
import { ABOUT, BRAND, IMAGES } from '../content'
import { postJson } from '../lib/api'
import type { Errors } from '../shared/validate'
import { validateContact } from '../shared/validate'

export function About() {
  return (
    <>
      <PageIntro eyebrow={ABOUT.eyebrow} title={ABOUT.title} lede={ABOUT.lede} />
      <Container>
        <div className="overflow-hidden rounded-[32px] border border-line">
          <Photo src={IMAGES.about} alt="A quiet study desk at night with open notebooks and a lamp" className="aspect-[16/8] w-full object-cover" />
        </div>
        <dl className="mt-12 grid grid-cols-3 gap-6 border-b border-line pb-12">
          {ABOUT.numbers.map((n) => (
            <div key={n.label} className="flex flex-col-reverse">
              <dt className="mt-2 text-[14px] text-muted">{n.label}</dt>
              <dd className="text-[clamp(36px,5vw,64px)] font-normal leading-none tracking-[-0.05em]">{n.value}</dd>
            </div>
          ))}
        </dl>
        <section className="py-20" aria-labelledby="values-title">
          <h2 id="values-title" className="text-[clamp(30px,3.6vw,46px)] font-normal tracking-[-0.045em]">
            What we hold to
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {ABOUT.values.map((v, i) => (
              <Reveal key={v.title} delay={i * 80} className="glass h-full rounded-[26px] p-7">
                <span className="font-mono text-[13px] text-leaf-text">0{i + 1}</span>
                <h3 className="mt-6 text-[20px] font-medium tracking-[-0.02em]">{v.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </section>
        <section id="contact" className="grid gap-10 border-t border-line py-20 lg:grid-cols-[0.8fr_1.2fr]" aria-labelledby="contact-title">
          <div>
            <h2 id="contact-title" className="text-[clamp(30px,3.6vw,46px)] font-normal tracking-[-0.045em]">
              {ABOUT.contactTitle}
            </h2>
            <p className="mt-4 text-[16px] text-muted">{ABOUT.contactLede}</p>
            <a href={`mailto:${BRAND.email}`} className="mt-6 inline-flex min-h-10 items-center text-[16px] text-leaf-text underline-offset-4 hover:underline">
              {BRAND.email}
            </a>
          </div>
          <ContactForm />
        </section>
      </Container>
    </>
  )
}

function ContactForm() {
  const [v, setV] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sent' | 'failed'>('idle')
  const [failure, setFailure] = useState('')
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => {
    setV({ ...v, [k]: e.target.value })
    setErrors({ ...errors, [k]: '' })
  }
  async function submit(e: FormEvent) {
    e.preventDefault()
    const errs = validateContact(v)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    const res = await postJson('/api/contact', v)
    setBusy(false)
    if (!res.ok) {
      if (res.errors) setErrors(res.errors)
      setFailure(res.error)
      return setStatus('failed')
    }
    setStatus('sent')
  }
  if (status === 'sent') return <Notice tone="success">Thanks, {v.name.split(' ')[0]}. We will reply to {v.email} within two working days.</Notice>
  return (
    <form onSubmit={submit} noValidate className="panel grid gap-5 rounded-[28px] p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Name" autoComplete="name" value={v.name} onChange={set('name')} error={errors.name} />
        <Input label="Email" type="email" autoComplete="email" value={v.email} onChange={set('email')} error={errors.email} />
      </div>
      <Textarea label="Message" rows={5} value={v.message} onChange={set('message')} error={errors.message} hint="School partnerships, press or anything else." />
      {status === 'failed' && <Notice tone="error">{failure}</Notice>}
      <Button type="submit" variant="paper" size="lg" loading={busy} className="justify-self-start">
        Send message
      </Button>
    </form>
  )
}
