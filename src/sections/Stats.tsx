import { Container } from '../components/Container'
import { CountUp } from '../components/CountUp'
import { STATS } from '../content'

export function Stats() {
  return (
    <section aria-label="Cramly in numbers" className="py-24">
      <Container>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col-reverse border-l border-line-strong pl-6">
              <dt className="mt-2 text-[14.5px] text-muted">{s.label}</dt>
              <dd className="text-[clamp(40px,4.6vw,60px)] font-normal leading-none tracking-[-0.05em] text-fg">
                <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
