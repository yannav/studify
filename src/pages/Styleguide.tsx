import { useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowRight, FileUp, Plus, Upload } from 'lucide-react'

import { Accordion } from '../components/Accordion'
import { Avatar } from '../components/Avatar'
import { Badge, Eyebrow } from '../components/Badge'
import { Button, IconButton } from '../components/Button'
import type { Force, Variant } from '../components/Button'
import { ChatBubble } from '../components/ChatBubble'
import { Container } from '../components/Container'
import { EmptyState } from '../components/EmptyState'
import { Checkbox, Input, Select, Textarea } from '../components/Field'
import { FileIcon } from '../components/FileIcon'
import { FileStack } from '../components/FileStack'
import { GlyphRow } from '../components/Glyphs'
import { Kbd } from '../components/Kbd'
import { Logo } from '../components/Logo'
import { Modal } from '../components/Modal'
import { Notice } from '../components/Notice'
import { PlanCard } from '../components/PlanCard'
import { ProgressBar, ScoreRing } from '../components/Progress'
import { Segmented } from '../components/Segmented'
import { Skeleton } from '../components/Skeleton'
import { useToast } from '../components/Toast'
import { TypingDots } from '../components/TypingDots'
import { FAQ, PLANS } from '../content'

const COLORS = [
  { name: 'bg', hex: '#050906', use: 'Page background' },
  { name: 'night', hex: '#07100A', use: 'Alternate band, app sidebar' },
  { name: 'panel', hex: '#0C150F', use: 'Cards, dialogs' },
  { name: 'panel-2', hex: '#111D15', use: 'Raised panel' },
  { name: 'raised', hex: '#17251B', use: 'Highest surface' },
  { name: 'fg', hex: '#EEF4EE', use: 'Primary text' },
  { name: 'soft', hex: '#CFDBD1', use: 'Body text' },
  { name: 'muted', hex: '#9FB0A3', use: 'Secondary text' },
  { name: 'faint', hex: '#7F9184', use: 'Hints, placeholders' },
  { name: 'leaf', hex: '#7EE068', use: 'Accent fill, focus ring' },
  { name: 'leaf-text', hex: '#8DEB77', use: 'Accent text' },
  { name: 'leaf-deep', hex: '#1F5A2A', use: 'Accent gradients' },
  { name: 'glow', hex: '#2FC24C', use: 'Ambient light' },
  { name: 'paper', hex: '#F5F7F3', use: 'Primary button' },
  { name: 'ink', hex: '#08100A', use: 'Text on light fills' },
  { name: 'danger', hex: '#FF7A6B', use: 'Errors, destructive' },
  { name: 'amber', hex: '#F3C15A', use: 'Due, streaks' },
]

const TYPE = [
  { name: 'Display', cls: 'text-[84px] leading-[0.98] tracking-[-0.06em]', spec: '84 / 0.98, -6%, 400' },
  { name: 'H1', cls: 'text-[60px] leading-none tracking-[-0.05em]', spec: '60 / 1.0, -5%, 400' },
  { name: 'H2', cls: 'text-[46px] leading-[1.02] tracking-[-0.045em]', spec: '46 / 1.02, -4.5%, 400' },
  { name: 'H3', cls: 'text-[22px] font-medium tracking-[-0.03em]', spec: '22, -3%, 500' },
  { name: 'Body large', cls: 'text-[17px] leading-relaxed text-soft', spec: '17 / 1.6, 400' },
  { name: 'Body', cls: 'text-[15px] leading-relaxed text-soft', spec: '15 / 1.6, 400' },
  { name: 'Small', cls: 'text-[13px] text-muted', spec: '13, 400' },
  { name: 'Mono', cls: 'font-mono text-[13px] text-leaf-text', spec: 'JetBrains Mono 13' },
]

const SPACE = [4, 8, 12, 16, 20, 24, 32, 48, 64, 96, 144]
const RADII = [
  { name: 'control', v: '14px' },
  { name: 'card', v: '22px' },
  { name: 'panel', v: '32px' },
  { name: 'pill', v: '999px' },
]
const SHADOWS = ['card', 'glass', 'float', 'glow', 'button']
const MOTION = [
  { name: 'rise', anim: 'animate-rise', spec: '760ms brand ease, entrance' },
  { name: 'pop', anim: 'animate-pop', spec: '420ms brand ease, dialogs and toasts' },
  { name: 'float', anim: 'animate-float', spec: '9s loop, ambient' },
  { name: 'glow', anim: 'animate-glow', spec: '7s loop, hero light' },
  { name: 'typing', anim: 'animate-typing', spec: '1.2s loop, thinking dots' },
]
const VARIANTS: Variant[] = ['paper', 'leaf', 'tint', 'glass', 'ghost', 'danger']
const STATES: { label: string; force?: Force; disabled?: boolean; loading?: boolean }[] = [
  { label: 'Default' },
  { label: 'Hover', force: 'hover' },
  { label: 'Focus', force: 'focus' },
  { label: 'Pressed', force: 'pressed' },
  { label: 'Disabled', disabled: true },
  { label: 'Loading', loading: true },
]

function Block({ title, children, id }: { title: string; children: ReactNode; id: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-t`} className="border-t border-line py-14">
      <h2 id={`${id}-t`} className="mb-8 text-[28px] font-normal tracking-[-0.04em]">
        {title}
      </h2>
      {children}
    </section>
  )
}

export function Styleguide() {
  const [replay, setReplay] = useState(0)
  const [modal, setModal] = useState(false)
  const [seg, setSeg] = useState<'a' | 'b' | 'c'>('a')
  const toast = useToast()
  return (
    <Container className="py-16">
      <Eyebrow>Design system</Eyebrow>
      <h1 className="mt-4 text-[clamp(40px,5vw,64px)] font-normal tracking-[-0.05em]">Cramly style guide</h1>
      <p className="mt-4 max-w-2xl text-[17px] text-muted">Every token and component, rendered by the real code. Tokens live in src/styles.css; components in src/components.</p>
      <nav aria-label="Sections" className="mt-8 flex flex-wrap gap-2">
        {['colour', 'type', 'space', 'radii', 'shadow', 'motion', 'buttons', 'fields', 'feedback', 'content'].map((s) => (
          <a key={s} href={`#${s}`} className="btn btn-glass btn-sm h-10 capitalize">
            {s}
          </a>
        ))}
      </nav>

      <Block title="Colour" id="colour">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {COLORS.map((c) => (
            <li key={c.name} className="panel overflow-hidden rounded-[18px]">
              <div className="h-20 border-b border-line" style={{ background: c.hex }} />
              <div className="p-3">
                <p className="text-[14px] font-medium">{c.name}</p>
                <p className="font-mono text-[12px] text-muted">{c.hex}</p>
                <p className="mt-1 text-[12px] text-faint">{c.use}</p>
              </div>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Type" id="type">
        <p className="mb-6 text-[14px] text-muted">Albert Sans for everything, JetBrains Mono for numbers in lists.</p>
        <div className="grid gap-6">
          {TYPE.map((t) => (
            <div key={t.name} className="grid items-baseline gap-2 md:grid-cols-[180px_1fr]">
              <p className="text-[13px] text-faint">
                {t.name}
                <br />
                {t.spec}
              </p>
              <p className={`${t.cls} min-w-0 truncate`}>Study smarter, not longer</p>
            </div>
          ))}
          <p className="text-[56px] leading-none tracking-[-0.06em]">
            <span className="text-gradient-leaf">Leaf gradient</span> for display accents
          </p>
        </div>
      </Block>

      <Block title="Spacing" id="space">
        <div className="flex flex-wrap items-end gap-4">
          {SPACE.map((s) => (
            <div key={s} className="grid justify-items-center gap-2">
              <div className="rounded-md bg-leaf/70" style={{ width: s, height: s }} />
              <span className="font-mono text-[12px] text-muted">{s}</span>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Radii" id="radii">
        <div className="flex flex-wrap gap-4">
          {RADII.map((r) => (
            <div key={r.name} className="grid justify-items-center gap-2">
              <div className="glass size-28" style={{ borderRadius: r.v }} />
              <span className="text-[13px] text-muted">
                {r.name} {r.v}
              </span>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Shadows and surfaces" id="shadow">
        <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {SHADOWS.map((s) => (
            <div key={s} className="grid h-32 place-items-center rounded-[22px] bg-panel text-[13px] text-muted" style={{ boxShadow: `var(--shadow-${s})` }}>
              shadow-{s}
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="glass rounded-[22px] p-6 text-[14px] text-soft">.glass: frosted green tint, used by the file stack, chat and quiz.</div>
          <div className="panel rounded-[22px] p-6 text-[14px] text-soft">.panel: solid surface with a hairline border.</div>
        </div>
      </Block>

      <Block title="Motion" id="motion">
        <Button variant="glass" size="md" className="mb-6" onClick={() => setReplay((r) => r + 1)}>
          Replay
        </Button>
        <div className="grid gap-4 sm:grid-cols-5" key={replay}>
          {MOTION.map((m) => (
            <div key={m.name} className="panel grid justify-items-center gap-3 rounded-[22px] p-5 text-center">
              <div className={`round size-12 rounded-full bg-leaf ${m.anim}`} />
              <p className="text-[14px] font-medium">{m.name}</p>
              <p className="text-[12px] text-muted">{m.spec}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[13px] text-faint">Durations: fast 150ms, base 260ms, slow 700ms. Reduced motion turns every animation off.</p>
      </Block>

      <Block title="Buttons" id="buttons">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-[13px]">
            <thead>
              <tr className="text-faint">
                <th className="pb-4 font-normal">Variant</th>
                {STATES.map((s) => (
                  <th key={s.label} className="pb-4 font-normal">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {VARIANTS.map((v) => (
                <tr key={v}>
                  <th scope="row" className="py-2 font-normal text-muted">
                    {v}
                  </th>
                  {STATES.map((s) => (
                    <td key={s.label} className="py-2 pr-3">
                      <Button variant={v} size="md" force={s.force} disabled={s.disabled} loading={s.loading} tabIndex={-1}>
                        Upload
                      </Button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg" iconRight={<ArrowRight className="size-4" />}>
            Large
          </Button>
          <Button size="xl" icon={<Upload className="size-4" />}>
            Hero
          </Button>
          <IconButton label="Add">
            <Plus className="size-4" />
          </IconButton>
          <IconButton label="Add (leaf)" variant="leaf">
            <Plus className="size-4" />
          </IconButton>
          <IconButton label="Add (small)" size="sm" force="hover">
            <Plus className="size-4" />
          </IconButton>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Segmented label="Example switch" value={seg} onChange={setSeg} options={[{ value: 'a', label: 'Monthly' }, { value: 'b', label: 'Yearly' }, { value: 'c', label: 'Lifetime' }]} />
          <a className="nav-link inline-flex min-h-10 items-center text-[14px]" href="#buttons">
            Nav link
          </a>
          <a className="nav-link inline-flex min-h-10 items-center text-[14px]" data-force="hover" href="#buttons">
            Nav hover
          </a>
          <a className="nav-link inline-flex min-h-10 items-center text-[14px]" aria-current="page" href="#buttons">
            Nav current
          </a>
        </div>
      </Block>

      <Block title="Fields" id="fields">
        <div className="grid gap-6 md:grid-cols-3">
          <Input label="Default" placeholder="you@school.edu" />
          <Input label="Hover" placeholder="you@school.edu" force="hover" />
          <Input label="Focus" placeholder="you@school.edu" force="focus" />
          <Input label="With hint" hint="We never share your email." defaultValue="sam@uni.edu" />
          <Input label="Error" defaultValue="sam@uni" error="Enter a valid email, like you@school.edu." />
          <Input label="Disabled" disabled defaultValue="Locked" />
          <Select label="Select" defaultValue="University">
            <option>High school</option>
            <option>University</option>
          </Select>
          <Textarea label="Textarea" rows={3} placeholder="Ask about this file…" />
          <div className="grid content-start gap-4 pt-7">
            <Checkbox label="Checked" defaultChecked />
            <Checkbox label="Unchecked" />
            <Checkbox label="With error" error="Accept the terms to continue." />
          </div>
        </div>
      </Block>

      <Block title="Feedback and states" id="feedback">
        <div className="grid gap-4 md:grid-cols-3">
          <Notice tone="success">Your study pack is ready.</Notice>
          <Notice tone="error">Files can be up to 25 MB on the free plan.</Notice>
          <Notice tone="info">Only the file name and size leave your browser.</Notice>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Badge>Neutral</Badge>
          <Badge tone="leaf">Leaf</Badge>
          <Badge tone="amber">3 cards due</Badge>
          <Badge tone="danger">Danger</Badge>
          <Kbd>Space</Kbd>
          <TypingDots />
          <Avatar name="Amara Obi" />
        </div>
        <div className="mt-8 grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div className="grid gap-4">
            <ProgressBar label="Example progress at 0" value={0} />
            <ProgressBar label="Example progress at 60" value={60} />
            <ProgressBar label="Example progress at 100" value={100} />
            <div className="flex gap-3">
              <Skeleton className="size-12" />
              <div className="grid flex-1 gap-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          </div>
          <ScoreRing value={4} max={5} />
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <EmptyState icon={<FileUp className="size-6" />} title="Empty state" body="Shown when a list has nothing to show yet." action={<Button variant="paper">Primary action</Button>} />
          <div className="flex flex-wrap content-start gap-3">
            <Button variant="glass" onClick={() => setModal(true)}>
              Open dialog
            </Button>
            <Button variant="glass" onClick={() => toast('This is a toast')}>
              Show toast
            </Button>
          </div>
        </div>
        <Modal open={modal} onClose={() => setModal(false)} title="Dialog title" description="Escape, the close button or the backdrop dismiss it.">
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setModal(false)}>
              Cancel
            </Button>
            <Button variant="paper" onClick={() => setModal(false)}>
              Confirm
            </Button>
          </div>
        </Modal>
      </Block>

      <Block title="Content components" id="content">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="grid gap-4">
            <ChatBubble from="you" text="What is the difference between mitosis and meiosis?" />
            <ChatBubble from="cramly" text="Mitosis makes **two identical cells**; meiosis makes **four different** ones." cite="p. 3" />
            <ChatBubble from="cramly" text="You appear to be offline." error onRetry={() => toast('Retrying')} />
          </div>
          <div className="grid justify-items-start gap-6">
            <FileStack />
            <div className="flex gap-2">
              {(['pdf', 'doc', 'png', 'txt', 'ppt'] as const).map((k) => (
                <FileIcon key={k} kind={k} />
              ))}
            </div>
            <div className="flex items-center gap-6">
              <Logo withName />
              <GlyphRow />
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {PLANS.map((p) => (
            <PlanCard key={p.id} plan={p} yearly={false} />
          ))}
        </div>
        <Accordion items={FAQ.slice(0, 3)} className="mt-10" />
      </Block>
    </Container>
  )
}
