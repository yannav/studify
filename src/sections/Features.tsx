import { Languages, Lock, MessageSquareText, Timer } from 'lucide-react'

import { Container } from '../components/Container'
import { Photo } from '../components/Photo'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { FEATURES, IMAGES } from '../content'

const ICONS = { message: MessageSquareText, lock: Lock, languages: Languages, timer: Timer }

export function Features() {
  return (
    <section id="features" className="relative py-28 md:py-36">
      <Container>
        <SectionHeading eyebrow={FEATURES.eyebrow} title={FEATURES.title} lede={FEATURES.lede} />
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {FEATURES.items.map((f, i) => (
            <Reveal key={f.title} delay={i * 90}>
              <article className="panel group flex h-full flex-col overflow-hidden rounded-[30px]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Photo src={IMAGES[f.image]} alt="" className="size-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-brand)] group-hover:scale-[1.04]" />
                  <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-panel to-transparent" />
                </div>
                <div className="-mt-6 p-7 pt-0">
                  <h3 className="relative text-[22px] font-medium leading-tight tracking-[-0.03em]">{f.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{f.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.extras.map((x, i) => {
            const Icon = ICONS[x.icon]
            return (
              <li key={x.title}>
                <Reveal delay={i * 70} className="glass flex h-full items-start gap-4 rounded-[24px] p-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-leaf-soft text-leaf-text">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <span>
                    <span className="block text-[15.5px] font-medium">{x.title}</span>
                    <span className="mt-1 block text-[14px] leading-snug text-muted">{x.body}</span>
                  </span>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
