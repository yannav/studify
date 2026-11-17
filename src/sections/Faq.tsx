import { Accordion } from '../components/Accordion'
import { Container } from '../components/Container'
import { SectionHeading } from '../components/SectionHeading'
import { FAQ } from '../content'

export function Faq() {
  return (
    <section className="py-24 md:py-32">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading eyebrow="Questions" title="Good questions, honest answers" />
        <Accordion items={FAQ} />
      </Container>
    </section>
  )
}
