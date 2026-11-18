import { Container } from '../components/Container'
import { GlyphRow } from '../components/Glyphs'
import { Logo } from '../components/Logo'
import { FOOTER } from '../content'
import { useT } from '../lib/i18n'
import { Link } from '../lib/router'

export function Footer() {
  const t = useT()
  return (
    <footer className="border-t border-line pb-10 pt-16">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo withName />
            <p className="mt-4 max-w-xs text-[14.5px] leading-relaxed text-muted">{t(FOOTER.blurb)}</p>
          </div>
          {FOOTER.columns.map((c) => (
            <nav key={c.title} aria-label={t(c.title)}>
              <h2 className="text-[13px] font-medium text-faint">{t(c.title)}</h2>
              <ul className="mt-3 grid">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex min-h-10 items-center text-[14.5px] text-soft transition-colors hover:text-leaf-text">
                      {t(l.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-[13.5px] text-faint">
          <p>{t(FOOTER.legal)}</p>
          <GlyphRow />
        </div>
      </Container>
    </footer>
  )
}
