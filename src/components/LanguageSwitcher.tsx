import { Languages } from 'lucide-react'

import { cx } from '../lib/cx'
import { LOCALES, useI18n } from '../lib/i18n'
import type { Locale } from '../lib/i18n'

/**
 * Picks the interface language. The choice is stored in localStorage by the
 * provider and applied on the next visit.
 */
export function LanguageSwitcher({ className, tone = 'glass' }: { className?: string; tone?: 'glass' | 'plain' }) {
  const { locale, setLocale, t } = useI18n()
  return (
    <label className={cx('relative inline-flex items-center gap-2', className)}>
      <Languages aria-hidden className="pointer-events-none size-4 shrink-0 text-muted" />
      <span className="sr-only">{t('Language')}</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        aria-label={t('Language')}
        className={cx(
          'h-10 appearance-none rounded-full border px-3 pr-7 text-[13.5px] text-soft outline-none transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf',
          tone === 'glass' ? 'border-line-strong bg-white/5' : 'border-transparent bg-transparent',
        )}
        style={{ backgroundImage: 'none' }}
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code} className="bg-panel text-fg">
            {l.native}
          </option>
        ))}
      </select>
      <svg aria-hidden viewBox="0 0 10 6" className="pointer-events-none absolute right-2.5 size-2.5 text-muted">
        <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </label>
  )
}
