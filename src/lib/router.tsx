import { forwardRef, useSyncExternalStore } from 'react'
import type { AnchorHTMLAttributes, MouseEvent } from 'react'

/*
  A tiny History API router. `useLocation()` re-renders on navigation,
  `navigate()` pushes a URL, and `<Link>` turns same-origin clicks into
  navigations (modifier clicks and external URLs behave like normal links).
  The Worker serves index.html for every unknown path (SPA mode), so deep
  links and reloads land on the right page.
*/

const EVENT = 'cramly:navigate'

export type Location = { path: string; hash: string; search: string }

function normalise(path: string) {
  const p = path.replace(/\/+$/, '')
  return p === '' ? '/' : p
}

let cached: Location | null = null
function snapshot(): Location {
  const next = { path: normalise(window.location.pathname), hash: window.location.hash, search: window.location.search }
  if (!cached || cached.path !== next.path || cached.hash !== next.hash || cached.search !== next.search) cached = next
  return cached
}

function subscribe(cb: () => void) {
  window.addEventListener('popstate', cb)
  window.addEventListener(EVENT, cb)
  return () => {
    window.removeEventListener('popstate', cb)
    window.removeEventListener(EVENT, cb)
  }
}

export function useLocation(): Location {
  return useSyncExternalStore(subscribe, snapshot, snapshot)
}

export function navigate(to: string, { replace = false }: { replace?: boolean } = {}) {
  const url = new URL(to, window.location.href)
  const same = url.pathname === window.location.pathname && url.search === window.location.search
  if (same && url.hash === window.location.hash) {
    // Same URL: just re-run the scroll (e.g. clicking the active nav link).
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { scroll: true } }))
    scrollToHash(url.hash, true)
    return
  }
  window.history[replace ? 'replaceState' : 'pushState']({}, '', url.pathname + url.search + url.hash)
  window.dispatchEvent(new Event(EVENT))
}

export function scrollToHash(hash: string, smooth = true) {
  if (!hash) {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    return
  }
  const el = document.getElementById(decodeURIComponent(hash.slice(1)))
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: smooth && !reduce ? 'smooth' : ('instant' as ScrollBehavior), block: 'start' })
}

/** Match `/blog/:slug`-style patterns. Returns params or null. */
export function match(pattern: string, path: string): Record<string, string> | null {
  const a = pattern.split('/').filter(Boolean)
  const b = path.split('/').filter(Boolean)
  if (a.length !== b.length) return null
  const params: Record<string, string> = {}
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(':')) params[a[i].slice(1)] = decodeURIComponent(b[i])
    else if (a[i] !== b[i]) return null
  }
  return params
}

/** True when `href` points at the current page (ignoring the hash). */
export function isCurrent(href: string, path: string, { exact = false } = {}) {
  const target = normalise(href.split('#')[0].split('?')[0] || path)
  if (exact || target === '/') return target === path
  return path === target || path.startsWith(target + '/')
}

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ href, onClick, target, ...rest }, ref) {
  const internal = href.startsWith('/') || href.startsWith('#')
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || !internal || target === '_blank') return
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(href.startsWith('#') ? window.location.pathname + href : href)
  }
  return <a ref={ref} href={href} target={target} onClick={handle} {...rest} />
})
