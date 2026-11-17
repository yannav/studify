import { ButtonLink } from '../components/Button'
import { Container } from '../components/Container'
import { Photo } from '../components/Photo'
import { IMAGES } from '../content'

export function NotFound() {
  return (
    <Container className="grid min-h-[70vh] place-items-center py-20 text-center">
      <div className="grid justify-items-center">
        <Photo src={IMAGES.mascot} alt="" aria-hidden className="round size-36 rounded-full border border-leaf/30 object-cover shadow-glow" />
        <p className="mt-8 font-mono text-[14px] text-leaf-text">404</p>
        <h1 className="mt-3 text-[clamp(36px,5vw,60px)] font-normal tracking-[-0.05em]">This page isn’t in your notes</h1>
        <p className="mt-4 max-w-md text-[16px] text-muted">The link may be old, or the page moved. Your library is safe.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="paper" size="lg">
            Back to home
          </ButtonLink>
          <ButtonLink href="/app" variant="tint" size="lg">
            Open the app
          </ButtonLink>
        </div>
      </div>
    </Container>
  )
}
