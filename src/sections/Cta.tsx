import { ArrowRight } from 'lucide-react'

import { ButtonLink } from '../components/Button'
import { Container } from '../components/Container'
import { NewsletterForm } from '../components/NewsletterForm'
import { Photo } from '../components/Photo'
import { CTA, IMAGES } from '../content'

export function Cta() {
  return (
    <section className="pb-24 pt-8">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[36px] border border-line-strong">
          <Photo src={IMAGES.cta} alt="A hooded robot studying a wall of glowing diagrams" className="absolute inset-0 -z-10 size-full object-cover" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-bg/95 via-bg/60 to-transparent" />
          <div className="max-w-xl px-7 py-16 sm:px-12 md:py-24">
            <h2 className="text-[clamp(34px,4.4vw,58px)] font-normal leading-[1] tracking-[-0.05em]">{CTA.title}</h2>
            <p className="mt-5 text-[17px] text-soft">{CTA.lede}</p>
            <ButtonLink href="/signup" variant="paper" size="lg" className="mt-8" iconRight={<ArrowRight className="size-4" />}>
              {CTA.primary}
            </ButtonLink>
          </div>
        </div>
        <div className="mt-5 grid items-center gap-6 rounded-[28px] border border-line bg-panel p-7 md:grid-cols-[1fr_1.1fr] md:p-9">
          <div>
            <h3 className="text-[22px] font-medium tracking-[-0.03em]">{CTA.newsletterTitle}</h3>
            <p className="mt-1.5 text-[15px] text-muted">{CTA.newsletterLede}</p>
          </div>
          <NewsletterForm />
        </div>
      </Container>
    </section>
  )
}
