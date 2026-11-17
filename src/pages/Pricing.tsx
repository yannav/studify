import { Check, Minus } from 'lucide-react'

import { Container } from '../components/Container'
import { PageIntro } from '../components/PageIntro'
import { COMPARE, PLANS } from '../content'
import { Faq } from '../sections/Faq'
import { PricingPlans } from '../sections/PricingPlans'

export function Pricing() {
  return (
    <>
      <PageIntro eyebrow="Pricing" title="Pay for the semester you are having" lede="Start free with one course. Upgrade when your timetable fills up, and cancel any time from Settings." />
      <div className="-mt-16">
        <PricingPlans heading={false} />
      </div>
      <section className="pb-12" aria-labelledby="compare-title">
        <Container>
          <h2 id="compare-title" className="text-[28px] font-normal tracking-[-0.04em]">
            Compare plans
          </h2>
          <div className="mt-8 overflow-x-auto rounded-[26px] border border-line" tabIndex={0} role="region" aria-label="Plan comparison table">
            <table className="w-full min-w-[620px] border-collapse text-left text-[14.5px]">
              <thead>
                <tr className="bg-panel">
                  <th scope="col" className="px-6 py-4 font-medium text-muted">
                    Feature
                  </th>
                  {PLANS.map((p) => (
                    <th key={p.id} scope="col" className="px-6 py-4 font-medium">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row) => (
                  <tr key={row.label} className="border-t border-line">
                    <th scope="row" className="px-6 py-4 font-normal text-soft">
                      {row.label}
                    </th>
                    {row.values.map((v, i) => (
                      <td key={i} className="px-6 py-4">
                        {v === true ? <Check aria-label="Included" className="size-4.5 text-leaf-text" /> : v === false ? <Minus aria-label="Not included" className="size-4.5 text-faint" /> : <span className="text-fg">{v}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>
      <Faq />
    </>
  )
}
