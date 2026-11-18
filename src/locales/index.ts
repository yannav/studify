import type { Locale } from '../lib/i18n'
import { de } from './de'
import { el } from './el'
import { es } from './es'
import { fr } from './fr'
import { it } from './it'
import { nl } from './nl'
import { pl } from './pl'
import { pt } from './pt'
import type { Dict } from './types'

/** English is the source language, so it needs no dictionary. */
export const DICTS: Partial<Record<Locale, Dict>> = { es, fr, de, pt, it, nl, pl, el }
