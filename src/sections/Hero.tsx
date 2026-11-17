import { useState } from 'react'

import { Button } from '../components/Button'
import { FileStack } from '../components/FileStack'
import { Glyph, GlyphRow } from '../components/Glyphs'
import { Photo } from '../components/Photo'
import { UploadDialog } from '../components/UploadDialog'
import { HERO, IMAGES } from '../content'

/** The reference screen: title, file stack, upload action and the hooded study bot. */
export function Hero() {
  const [open, setOpen] = useState(false)
  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-title">
      {/* Ambient light: a green bloom between the copy and the figure. */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-[radial-gradient(120%_90%_at_70%_40%,#0d2614_0%,#07120a_45%,var(--color-bg)_80%)]" />
      <div aria-hidden className="absolute left-[44%] top-[34%] -z-10 size-[min(52vw,760px)] -translate-x-1/2 -translate-y-1/2 animate-glow rounded-full bg-[radial-gradient(circle,rgb(47_194_76/0.55)_0%,rgb(47_194_76/0.18)_38%,transparent_68%)] blur-2xl" />

      <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[56%] lg:block">
        <Photo
          eager
          src={IMAGES.hero}
          alt="A hooded study robot with a glowing green eye"
          className="absolute right-[2%] top-0 h-full w-auto max-w-none object-cover object-top [mask-image:radial-gradient(ellipse_52%_72%_at_50%_42%,#000_62%,transparent_100%)]"
        />
      </div>

      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-bg to-transparent" />

      <div className="relative min-h-[max(760px,100svh)] px-5 pb-16 pt-[128px] sm:px-8 lg:pb-0 lg:pl-[clamp(48px,14.5vw,220px)] lg:pt-[150px]">
        <h1 id="hero-title" className="text-[clamp(48px,5.6vw,84px)] font-normal leading-[0.98] tracking-[-0.06em]">
          <span className="block text-fg">{HERO.titleTop}</span>
          <span className="text-gradient-leaf block pb-[0.06em]">{HERO.titleBottom}</span>
        </h1>
        <p className="mt-6 max-w-[400px] text-[17px] leading-[1.4] tracking-[-0.01em] text-soft">{HERO.lede}</p>

        <div className="relative mt-12 w-[300px] max-w-full">
          <FileStack />
          <Button variant="paper" size="xl" className="relative z-40 -mt-[30px] h-[74px] w-full max-w-[330px] rounded-[38px] lg:-ml-[22px] lg:w-[330px] text-[17.5px] font-semibold" onClick={() => setOpen(true)}>
            {HERO.cta}
          </Button>
        </div>

        <GlyphRow className="mt-14 hidden lg:flex" />

        {/* Small-screen figure, below the copy. */}
        <div className="relative mt-12 lg:hidden">
          <Photo src={IMAGES.hero} alt="" aria-hidden className="mx-auto h-[460px] w-auto [mask-image:radial-gradient(ellipse_50%_52%_at_50%_45%,#000_55%,transparent_100%)]" />
        </div>

        <p className="mt-6 flex max-w-[330px] items-start gap-3 text-[15.5px] leading-[1.35] text-soft lg:absolute lg:bottom-[56px] lg:right-[clamp(24px,6vw,96px)] lg:mt-0">
          <Glyph shape="x" className="mt-1 shrink-0" />
          {HERO.caption}
        </p>
      </div>

      <UploadDialog open={open} onClose={() => setOpen(false)} />
    </section>
  )
}
