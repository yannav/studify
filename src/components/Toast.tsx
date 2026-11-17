import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { CircleCheck } from 'lucide-react'

type Toast = { id: number; text: string }
const Ctx = createContext<(text: string) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([])
  const push = useCallback((text: string) => {
    const id = Date.now() + Math.random()
    setItems((t) => [...t, { id, text }])
    window.setTimeout(() => setItems((t) => t.filter((x) => x.id !== id)), 3600)
  }, [])
  return (
    <Ctx.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex flex-col items-center gap-2 px-4">
        {items.map((t) => (
          <div key={t.id} className="flex animate-pop items-center gap-2.5 rounded-full border border-leaf/25 bg-panel-2/95 px-5 py-3 text-[14px] shadow-float backdrop-blur">
            <CircleCheck aria-hidden className="size-4 text-leaf-text" />
            {t.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export const useToast = () => useContext(Ctx)
