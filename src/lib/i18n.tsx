import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { DICTS } from '../locales'
import { migrateLegacyStorage } from './legacy'

export type Locale = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'it' | 'nl' | 'pl' | 'el'

/** Every language the UI can be switched into, with its own name for itself. */
export const LOCALES: { code: Locale; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'pt', label: 'Portuguese', native: 'Português' },
  { code: 'it', label: 'Italian', native: 'Italiano' },
  { code: 'nl', label: 'Dutch', native: 'Nederlands' },
  { code: 'pl', label: 'Polish', native: 'Polski' },
  { code: 'el', label: 'Greek', native: 'Ελληνικά' },
]

const STORAGE_KEY = 'studify:locale'

const isLocale = (v: unknown): v is Locale => LOCALES.some((l) => l.code === v)

function stored(): Locale {
  try {
    migrateLegacyStorage() // the old `cramly:locale` choice carries over once
    const v = window.localStorage.getItem(STORAGE_KEY)
    return isLocale(v) ? v : 'en'
  } catch {
    return 'en'
  }
}

type Vars = Record<string, string | number>
type Ctx = { locale: Locale; setLocale: (l: Locale) => void; t: (source: string, vars?: Vars) => string }

const I18nContext = createContext<Ctx | null>(null)

/**
 * Holds the chosen language. The English string is the dictionary key, so
 * anything not translated yet falls back to the English copy.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(stored)

  useEffect(() => {
    document.documentElement.lang = locale
    try {
      window.localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      /* private mode: keep it in memory only */
    }
  }, [locale])

  const t = useCallback(
    (source: string, vars?: Vars) => {
      let out = locale === 'en' ? source : DICTS[locale]?.[source] ?? source
      if (vars) for (const [k, v] of Object.entries(vars)) out = out.split(`{${k}}`).join(String(v))
      return out
    },
    [locale],
  )

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <LocaleProvider>')
  return ctx
}

/** Shorthand for components that only need the translation function. */
export function useT() {
  return useI18n().t
}
