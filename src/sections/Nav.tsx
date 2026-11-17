import { useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'

import { ButtonLink, IconButton } from '../components/Button'
import { GlyphRow } from '../components/Glyphs'
import { Logo } from '../components/Logo'
import { NAV } from '../content'
import { cx } from '../lib/cx'
import { useUser } from '../lib/library'
import { Link, isCurrent, useLocation } from '../lib/router'
import { useFocusTrap } from '../lib/useFocusTrap'

/** Top bar. Over the hero on the home page it floats; elsewhere it is solid. */
export function Nav({ overlay = false }: { overlay?: boolean }) {
  const { path } = useLocation()
  const [user] = useUser()
  const [open, setOpen] = useState(false)
  const drawer = useRef<HTMLDivElement>(null)
  useFocusTrap(drawer, open, () => setOpen(false))

  return (
    <header className={cx('z-40 w-full', overlay ? 'absolute inset-x-0 top-0' : 'sticky top-0 border-b border-line bg-bg/85 backdrop-blur-xl')}>
      <div className="flex h-[84px] items-center gap-6 px-5 sm:px-8 lg:h-[104px] lg:px-12">
        <Logo />
        <nav aria-label="Main" className="ml-[clamp(24px,5vw,72px)] hidden items-center gap-9 text-[14px] md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="nav-link py-2" aria-current={!n.href.includes('#') && isCurrent(n.href, path) ? 'page' : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-2.5 md:flex">
          {user ? (
            <ButtonLink href="/app" variant="tint" size="sm" className="h-10 px-5">
              Open app
            </ButtonLink>
          ) : (
            <>
              <ButtonLink href="/login" variant="tint" size="sm" className="h-10 px-5">
                Log In
              </ButtonLink>
              <ButtonLink href="/signup" variant="glass" size="sm" className="h-10 px-5">
                Sign Up
              </ButtonLink>
            </>
          )}
          <GlyphRow vertical className="ml-5 hidden xl:flex" />
        </div>
        <IconButton label="Open menu" className="ml-auto md:hidden" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-menu">
          <Menu className="size-5" />
        </IconButton>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div aria-hidden className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div ref={drawer} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" className="absolute inset-y-0 right-0 flex w-[min(340px,88vw)] animate-pop flex-col gap-2 border-l border-line bg-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <Logo withName />
              <IconButton label="Close menu" onClick={() => setOpen(false)}>
                <X className="size-5" />
              </IconButton>
            </div>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center rounded-2xl px-4 text-[17px] text-soft hover:bg-white/5 hover:text-fg">
                {n.label}
              </Link>
            ))}
            <div className="mt-auto grid gap-2">
              {user ? (
                <ButtonLink href="/app" variant="leaf" size="lg" onClick={() => setOpen(false)}>
                  Open app
                </ButtonLink>
              ) : (
                <>
                  <ButtonLink href="/signup" variant="paper" size="lg" onClick={() => setOpen(false)}>
                    Sign Up
                  </ButtonLink>
                  <ButtonLink href="/login" variant="tint" size="lg" onClick={() => setOpen(false)}>
                    Log In
                  </ButtonLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
