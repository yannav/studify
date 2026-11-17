import { Check } from 'lucide-react'

import type { Plan } from '../content'
import { cx } from '../lib/cx'
import { Badge } from './Badge'
import { ButtonLink } from './Button'

export function PlanCard({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  const price = yearly ? plan.yearly : plan.monthly
  return (
    <div className={cx('relative flex flex-col rounded-[28px] p-7', plan.featured ? 'glass border-leaf/30 shadow-[0_30px_80px_-30px_rgb(47_194_76/0.45)]' : 'panel')}>
      <div className="flex items-center justify-between">
        <h3 className="text-[19px] font-medium tracking-[-0.02em]">{plan.name}</h3>
        {plan.featured && <Badge tone="leaf">Most popular</Badge>}
      </div>
      <p className="mt-2 text-[14.5px] text-muted">{plan.blurb}</p>
      <p className="mt-7 flex items-baseline gap-1.5">
        <span className="text-[48px] font-normal leading-none tracking-[-0.05em]">${price}</span>
        <span className="text-[14px] text-muted">{price ? (yearly ? 'a month, billed yearly' : 'a month') : 'forever'}</span>
      </p>
      <ButtonLink href={`/signup?plan=${plan.id}`} variant={plan.featured ? 'leaf' : 'glass'} size="lg" block className="mt-7">
        {plan.cta}
      </ButtonLink>
      <ul className="mt-7 grid gap-3 text-[14.5px] text-soft">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-leaf-text" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}
