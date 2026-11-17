import { lazy, Suspense, useEffect, useRef } from 'react'
import type { ComponentType, ReactNode } from 'react'

import { ToastProvider } from './components/Toast'
import { BRAND } from './content'
import { scrollToHash, useLocation } from './lib/router'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Footer } from './sections/Footer'
import { Nav } from './sections/Nav'

// Inner pages load on demand so the landing page ships alone.
const page = <K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K) => lazy(() => load().then((m) => ({ default: m[name] })))
const Pricing = page(() => import('./pages/Pricing'), 'Pricing')
const About = page(() => import('./pages/About'), 'About')
const Login = page(() => import('./pages/Login'), 'Login')
const Signup = page(() => import('./pages/Signup'), 'Signup')
const Styleguide = page(() => import('./pages/Styleguide'), 'Styleguide')
const AppShell = lazy(() => import('./pages/app/AppShell').then((m) => ({ default: m.AppShell })))
const LibraryPage = page(() => import('./pages/app/Library'), 'LibraryPage')
const ChatPage = page(() => import('./pages/app/Chat'), 'ChatPage')
const FlashcardsPage = page(() => import('./pages/app/Flashcards'), 'FlashcardsPage')
const QuizPage = page(() => import('./pages/app/Quiz'), 'QuizPage')

/*
  The route table. `layout` picks the frame: the marketing site (nav and
  footer), the bare auth screens, or the app shell.
*/
type Route = { path: string; title: string; layout: 'site' | 'bare' | 'app'; render: () => ReactNode }

const routes: Route[] = [
  { path: '/', title: '', layout: 'site', render: () => <Home /> },
  { path: '/pricing', title: 'Pricing', layout: 'site', render: () => <Pricing /> },
  { path: '/about', title: 'About', layout: 'site', render: () => <About /> },
  { path: '/styleguide', title: 'Style guide', layout: 'site', render: () => <Styleguide /> },
  { path: '/login', title: 'Log in', layout: 'bare', render: () => <Login /> },
  { path: '/signup', title: 'Sign up', layout: 'bare', render: () => <Signup /> },
  { path: '/app', title: 'Library', layout: 'app', render: () => <LibraryPage /> },
  { path: '/app/chat', title: 'Ask', layout: 'app', render: () => <ChatPage /> },
  { path: '/app/flashcards', title: 'Flashcards', layout: 'app', render: () => <FlashcardsPage /> },
  { path: '/app/quiz', title: 'Quiz', layout: 'app', render: () => <QuizPage /> },
]

const Blank = () => <div className="min-h-screen" aria-busy="true" />

export function App() {
  const { path, hash } = useLocation()
  const hit = routes.find((r) => r.path === path)
  const main = useRef<HTMLElement>(null)
  const first = useRef(true)
  const title = hit ? hit.title : 'Page not found'

  useEffect(() => {
    document.title = title ? `${title} | ${BRAND.name}` : `${BRAND.name}: ${BRAND.tagline}`
  }, [title])

  // On navigation: jump to the hash target (once the lazy page renders) or the
  // top, and move focus to <main> so screen readers announce the new page.
  useEffect(() => {
    const isFirst = first.current
    first.current = false
    let raf = 0
    let tries = 0
    const run = () => {
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
      if (hash && !target && tries++ < 120) {
        raf = requestAnimationFrame(run)
        return
      }
      scrollToHash(hash, !isFirst)
      if (!isFirst && !hash) (main.current ?? document.getElementById('main'))?.focus({ preventScroll: true })
    }
    run()
    return () => cancelAnimationFrame(raf)
  }, [path, hash])

  let body: ReactNode
  if (hit?.layout === 'app') {
    body = (
      <Suspense fallback={<Blank />}>
        <AppShell>
          <Suspense fallback={<Blank />}>{hit.render()}</Suspense>
        </AppShell>
      </Suspense>
    )
  } else if (hit?.layout === 'bare') {
    body = <Suspense fallback={<Blank />}>{hit.render()}</Suspense>
  } else {
    body = (
      <>
        <Nav overlay={path === '/'} />
        <main id="main" ref={main} tabIndex={-1} className="outline-none">
          <Suspense fallback={<Blank />}>{hit ? hit.render() : <NotFound />}</Suspense>
        </main>
        <Footer />
      </>
    )
  }

  return <ToastProvider>{body}</ToastProvider>
}
