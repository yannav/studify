import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { useInView } from '../lib/useInView'

/** Fades children up the first time they scroll into view. */
export function Reveal({ children, delay = 0, className, as: Tag = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' }) {
  const [ref, seen] = useInView<HTMLDivElement & HTMLLIElement>()
  return (
    <Tag ref={ref} className={cx(seen ? 'animate-rise' : 'opacity-0', className)} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </Tag>
  )
}
