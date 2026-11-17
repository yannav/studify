
import { Container } from '../components/Container'
import { PlanCard } from '../components/PlanCard'
import { SectionHeading } from '../components/SectionHeading'
import { Segmented } from '../components/Segmented'
import { PLANS } from '../content'
import { useStored } from '../lib/storage'

/** Plans with a monthly/yearly switch (remembered between visits). */
export function PricingPlans({ heading = true, as = 'h2' }: { heading?: boolean; as?: 'h1' | 'h2' }) {
  const [billing, setBilling] = useStored<'monthly' | 'yearly'>('billing', 'yearly')
  return (
    <section id="pricing" className="py-24 md:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-8">
          {heading && <SectionHeading as={as} eyebrow="Pricing" title="Free for one course. Fair for all of them." lede="Students get the yearly price with any school email." />}
          <Segmented
            label="Billing period"
            value={billing}
            onChange={setBilling}
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: <>Yearly <span className="text-[12px] opacity-70">save 22%</span></> },
            ]}
          />
        </div>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {PLANS.map((p) => (
            <PlanCard key={p.id} plan={p} yearly={billing === 'yearly'} />
          ))}
        </div>
      </Container>
    </section>
  )
}
