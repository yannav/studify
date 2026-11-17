import type { ReactNode } from 'react'

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="inline-grid h-6 min-w-6 place-items-center rounded-md border border-line-strong bg-white/5 px-1.5 font-mono text-[11.5px] text-soft">{children}</kbd>
}
