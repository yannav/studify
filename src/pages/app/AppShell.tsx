import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Download, FileUp, Flame, Layers, Library, ListChecks, LogOut, MessageSquareText, RotateCcw, Upload, UserRound } from 'lucide-react'

import { Avatar } from '../../components/Avatar'
import { Button, ButtonLink } from '../../components/Button'
import { LanguageSwitcher } from '../../components/LanguageSwitcher'
import { Logo } from '../../components/Logo'
import { Modal } from '../../components/Modal'
import { Notice } from '../../components/Notice'
import { useToast } from '../../components/Toast'
import { UploadDialog } from '../../components/UploadDialog'
import { backupCounts, backupFileName, exportBackup, parseBackup, restoreBackup } from '../../lib/backup'
import type { Backup } from '../../lib/backup'
import { cx } from '../../lib/cx'
import { useT } from '../../lib/i18n'
import { resetDemo, streak, useDays, useUser } from '../../lib/library'
import { Link, navigate, useLocation } from '../../lib/router'

export const APP_NAV = [
  { href: '/app', label: 'Library', icon: Library },
  { href: '/app/chat', label: 'Ask', icon: MessageSquareText },
  { href: '/app/flashcards', label: 'Flashcards', icon: Layers },
  { href: '/app/quiz', label: 'Quiz', icon: ListChecks },
]

/** Frame for the demo app: sidebar on desktop, top bar and tab bar on phones. */
export function AppShell({ children }: { children: ReactNode }) {
  const t = useT()
  const { path, search } = useLocation()
  const [user, setUser] = useUser()
  const [days] = useDays()
  const [upload, setUpload] = useState(false)
  const [account, setAccount] = useState(false)
  const toast = useToast()
  const doc = new URLSearchParams(search).get('doc')
  const withDoc = (href: string) => (doc && href !== '/app' ? `${href}?doc=${doc}` : href)
  const s = streak(days)

  return (
    <div className="min-h-svh bg-bg lg:grid lg:grid-cols-[264px_1fr]">
      <aside className="sticky top-0 hidden h-svh flex-col border-r border-line bg-night px-4 py-6 lg:flex">
        <Logo withName href="/" className="px-3" />
        <Button variant="paper" size="md" className="mx-1 mt-8" icon={<Upload className="size-4" />} onClick={() => setUpload(true)}>
          {t('Upload file')}
        </Button>
        <nav aria-label="App" className="mt-6 grid gap-1">
          {APP_NAV.map((n) => {
            const on = path === n.href
            return (
              <Link
                key={n.href}
                href={withDoc(n.href)}
                aria-current={on ? 'page' : undefined}
                className={cx('flex h-11 items-center gap-3 rounded-2xl px-3.5 text-[14.5px] transition-colors', on ? 'bg-leaf-soft text-fg' : 'text-soft hover:bg-white/5 hover:text-fg')}
              >
                <n.icon aria-hidden className={cx('size-4.5', on && 'text-leaf-text')} />
                {t(n.label)}
              </Link>
            )
          })}
        </nav>
        <div className="glass mx-1 mt-8 rounded-[22px] p-4">
          <p className="flex items-center gap-2 text-[14px] font-medium">
            <Flame aria-hidden className="size-4 text-amber" />{' '}
            {s ? t('{n} day streak', { n: s }) : t('No streak yet')}
          </p>
          <p className="mt-1 text-[13px] leading-snug text-muted">
            {s ? t('Review a few cards today to keep it going.') : t('Study today to start a streak.')}
          </p>
        </div>
        <div className="mx-1 mt-4">
          <LanguageSwitcher tone="plain" className="w-full" />
        </div>
        <button type="button" onClick={() => setAccount(true)} className="mt-auto flex min-h-14 items-center gap-3 rounded-2xl px-3 text-left transition-colors hover:bg-white/5">
          {user ? <Avatar name={user.name} size={36} /> : <span className="round grid size-9 place-items-center rounded-full bg-white/8"><UserRound aria-hidden className="size-4.5 text-soft" /></span>}
          <span className="min-w-0">
            <span className="block truncate text-[14px] font-medium">{user?.name ?? t('Guest')}</span>
            <span className="block truncate text-[12.5px] text-muted">{user?.email ?? t('Demo library')}</span>
          </span>
        </button>
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-bg/90 px-4 backdrop-blur-xl lg:hidden">
        <Logo withName href="/" />
        <div className="flex items-center gap-2">
          <Button variant="paper" size="sm" className="h-10" icon={<Upload className="size-4" />} onClick={() => setUpload(true)}>
            {t('Upload')}
          </Button>
          <button type="button" aria-label={t('Account')} onClick={() => setAccount(true)} className="round grid size-10 place-items-center rounded-full">
            {user ? <Avatar name={user.name} size={36} /> : <UserRound aria-hidden className="size-5 text-soft" />}
          </button>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="min-w-0 pb-28 outline-none lg:pb-0">{children}</main>

      <nav aria-label="App" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-night/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
        {APP_NAV.map((n) => {
          const on = path === n.href
          return (
            <Link key={n.href} href={withDoc(n.href)} aria-current={on ? 'page' : undefined} className={cx('flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl text-[12px]', on ? 'text-leaf-text' : 'text-muted')}>
              <n.icon aria-hidden className="size-5" />
              {t(n.label)}
            </Link>
          )
        })}
      </nav>

      <UploadDialog open={upload} onClose={() => setUpload(false)} />
      <AccountDialog
        open={account}
        onClose={() => setAccount(false)}
        signedIn={!!user}
        onSignOut={() => {
          setUser(null)
          setAccount(false)
          toast(t('Signed out. Your demo library stays on this device.'))
        }}
        onReset={() => {
          resetDemo()
          setAccount(false)
          toast(t('Demo data reset'))
          navigate('/app')
        }}
        onRestored={(n) => {
          setAccount(false)
          toast(t('Backup restored: {n} files.', { n }))
          navigate('/app')
        }}
      />
    </div>
  )
}

function AccountDialog({ open, onClose, signedIn, onSignOut, onReset, onRestored }: { open: boolean; onClose: () => void; signedIn: boolean; onSignOut: () => void; onReset: () => void; onRestored: (docs: number) => void }) {
  const t = useT()
  const [confirm, setConfirm] = useState(false)
  const [restore, setRestore] = useState<Backup | null>(null)
  const [error, setError] = useState('')
  const file = useRef<HTMLInputElement>(null)

  function close() {
    setConfirm(false)
    setRestore(null)
    setError('')
    onClose()
  }

  function download() {
    const url = URL.createObjectURL(new Blob([exportBackup()], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = backupFileName()
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
    setError('')
  }

  async function pick(chosen: File) {
    setError('')
    setConfirm(false)
    let text: string
    try {
      text = await chosen.text()
    } catch {
      setError(t('We couldn’t read that file. Try choosing it again.'))
      return
    }
    const result = parseBackup(text)
    if (!result.ok) {
      setRestore(null)
      setError(t(result.error))
      return
    }
    setRestore(result.backup)
  }

  const counts = restore ? backupCounts(restore) : null

  return (
    <Modal open={open} onClose={close} title={t('Account')} description={t('Everything in this demo is stored in your browser.')}>
      <div className="grid gap-3">
        <LanguageSwitcher className="mb-1" />
        {signedIn ? (
          <Button variant="glass" size="lg" icon={<LogOut className="size-4" />} onClick={onSignOut}>
            {t('Sign out')}
          </Button>
        ) : (
          <ButtonLink href="/signup" variant="leaf" size="lg" onClick={onClose}>
            {t('Create a free account')}
          </ButtonLink>
        )}

        <div className="grid gap-3 rounded-2xl border border-line-strong bg-white/3 p-4">
          <p className="text-[13.5px] leading-snug text-muted">
            {t('This browser holds the only copy of your library. Download a backup before clearing site data or switching devices.')}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button variant="glass" icon={<Download className="size-4" />} onClick={download}>
              {t('Download backup')}
            </Button>
            <Button variant="glass" icon={<FileUp className="size-4" />} onClick={() => file.current?.click()}>
              {t('Restore backup')}
            </Button>
          </div>
          <input
            ref={file}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(e) => {
              const chosen = e.target.files?.[0]
              if (chosen) void pick(chosen)
              e.target.value = ''
            }}
          />
          {error && <Notice tone="error">{error}</Notice>}
        </div>

        {counts ? (
          <div className="grid gap-3 rounded-2xl border border-line-strong bg-white/5 p-4">
            <p className="text-[14px] leading-snug text-soft">
              {t('This replaces everything in this browser with the backup: {files} files, {cards} reviewed cards and {messages} chat messages.', {
                files: counts.docs,
                cards: counts.cards,
                messages: counts.messages,
              })}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="leaf"
                onClick={() => {
                  if (!restore) return
                  restoreBackup(restore)
                  onRestored(restore.data.docs.length)
                  close()
                }}
              >
                {t('Restore this backup')}
              </Button>
              <Button variant="ghost" onClick={() => setRestore(null)}>
                {t('Cancel')}
              </Button>
            </div>
          </div>
        ) : confirm ? (
          <div className="grid gap-3 rounded-2xl border border-danger/30 bg-danger-soft p-4">
            <p className="text-[14px] text-soft">
              {t('This removes your uploads, chats, card progress and quiz history from this browser.')}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="danger" onClick={() => { onReset(); close() }}>
                {t('Reset everything')}
              </Button>
              <Button variant="ghost" onClick={() => setConfirm(false)}>
                {t('Keep my data')}
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="ghost" size="lg" icon={<RotateCcw className="size-4" />} onClick={() => setConfirm(true)}>
            {t('Reset demo data')}
          </Button>
        )}
      </div>
    </Modal>
  )
}
