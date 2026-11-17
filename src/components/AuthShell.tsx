import type { ReactNode } from 'react'

import { AUTH, IMAGES } from '../content'
import { Logo } from './Logo'
import { Photo } from './Photo'

export function AuthShell({ title, lede, children, footer }: { title: string; lede: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_1fr]">
      <main id="main" tabIndex={-1} className="flex flex-col px-5 py-8 outline-none sm:px-10 lg:px-16">
        <Logo withName />
        <div className="mx-auto my-auto w-full max-w-[420px] py-12">
          <h1 className="text-[clamp(34px,4vw,46px)] font-normal leading-none tracking-[-0.05em]">{title}</h1>
          <p className="mt-3 text-[16px] text-muted">{lede}</p>
          <div className="mt-9">{children}</div>
          <p className="mt-8 text-[14.5px] text-muted">{footer}</p>
        </div>
      </main>
      <aside className="relative hidden overflow-hidden border-l border-line lg:block">
        <Photo src={IMAGES.hero} alt="" aria-hidden eager className="absolute inset-0 size-full object-cover object-top" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
        <blockquote className="glass absolute inset-x-10 bottom-10 rounded-[26px] p-6 text-[17px] leading-relaxed text-soft">{AUTH.aside}</blockquote>
      </aside>
    </div>
  )
}
