import { Avatar } from '../components/Avatar'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { TESTIMONIALS } from '../content'

export function Testimonials() {
  return (
    <section className="py-24 md:py-32" aria-labelledby="t-title">
      <Container>
        <SectionHeading eyebrow="Students" title={<span id="t-title">Less rereading, more remembering</span>} />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <figure className="panel flex h-full flex-col rounded-[28px] p-7">
                <blockquote className="text-[17px] leading-relaxed tracking-[-0.01em] text-soft">“{t.quote}”</blockquote>
                <figcaption className="mt-auto flex items-center gap-3 pt-8">
                  <Avatar name={t.name} />
                  <span>
                    <span className="block text-[15px] font-medium">{t.name}</span>
                    <span className="block text-[13.5px] text-muted">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
