import { Layers } from 'lucide-react'

import { ChatBubble } from '../components/ChatBubble'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { TypingDots } from '../components/TypingDots'
import { STEPS } from '../content'
import { useInView } from '../lib/useInView'

export function HowItWorks() {
  const [ref, seen] = useInView<HTMLDivElement>()
  return (
    <section id="how-it-works" className="relative overflow-hidden border-y border-line bg-night py-28 md:py-36">
      <div aria-hidden className="absolute -right-40 top-1/2 size-[640px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(47_194_76/0.22),transparent_65%)] blur-2xl" />
      <Container className="relative grid items-center gap-16 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <SectionHeading eyebrow={STEPS.eyebrow} title={STEPS.title} />
          <ol className="mt-12 grid gap-8">
            {STEPS.items.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 100} className="grid grid-cols-[56px_1fr] gap-5">
                  <span className="font-mono text-[14px] text-leaf-text">{s.n}</span>
                  <span>
                    <span className="block text-[20px] font-medium tracking-[-0.02em]">{s.title}</span>
                    <span className="mt-2 block text-[15.5px] leading-relaxed text-muted">{s.body}</span>
                  </span>
              </Reveal>
            ))}
          </ol>
        </div>

        <div ref={ref} className="glass rounded-[32px] p-5 sm:p-7" aria-label="Example conversation with Cramly">
          <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
            <p className="text-[14px] text-soft">BIO 201 Cell division.pdf</p>
            <span className="text-[12.5px] text-faint">14 pages</span>
          </div>
          <div className="grid gap-4">
            {STEPS.demo.map((m, i) =>
              seen ? (
                <div key={i} className="animate-pop" style={{ animationDelay: `${i * 700}ms` }}>
                  <ChatBubble from={m.from} text={m.text} cite={'cite' in m ? m.cite : undefined} compact />
                </div>
              ) : null,
            )}
            {seen && (
              <div className="animate-pop" style={{ animationDelay: '2100ms' }}>
                <ChatBubble from="cramly" compact>
                  <span className="flex items-center gap-2.5">
                    <Layers aria-hidden className="size-4 text-leaf-text" /> Building 5 cards <TypingDots label="Writing flashcards" />
                  </span>
                </ChatBubble>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
