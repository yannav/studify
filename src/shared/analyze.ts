import type { Answer, Card, Pack, Question } from './packs'

/*
  Builds a study pack from a document's own text.

  There is no model here: everything is extracted, scored and rewritten from the
  text the file actually contains, deterministically (same text in, same pack
  out). That keeps the demo free and offline, while making the pack, the
  flashcards, the quiz and the tutor answers depend on the content rather than
  on the file name. Swap `buildPack` for a model call to go further.
*/

const STOP = new Set(
  "a an the and or but if then than that this these those of in on at to for from by with without as is are was were be been being it its it's their there here we you they he she i not no yes can could should would will may might must do does did has have had into over under about after before between during more most other some such only also very just like so up out all any both each few many own same too now which who whom whose what when where why how made makes make used uses used given gives take takes took turned turns shows shown came come goes went said says seen saw found finds become became began start started".split(
    /\s+/,
  ),
)

const clean = (s: string) => s.replace(/\s+/g, ' ').trim()

const wordCount = (s: string) => s.split(/\s+/).filter(Boolean).length

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s)

const clip = (s: string, n: number) => (s.length <= n ? s : s.slice(0, n - 1).replace(/[\s,;:.-]+\S*$/, '') + '…')

const wordsOf = (s: string) => (s.match(/[\p{L}][\p{L}'’-]{2,}/gu) ?? []).map((w) => w.toLowerCase())

/** A short, unpunctuated, capitalised line: a heading, not a sentence. */
function isHeading(line: string): boolean {
  if (/[.!?:;]$/.test(line) || wordCount(line) > 8) return false
  return line.split(/\s+/).every((w) => /^[\p{Lu}\p{N}]/u.test(w) || STOP.has(w.toLowerCase()))
}

/**
 * Sentences long enough to be worth studying, cleaned and de-duplicated.
 * Line breaks matter twice: a PDF wraps sentences mid-line (so wrapped lines are
 * joined back together) and a document has headings (which are dropped).
 */
function sentencesOf(text: string): string[] {
  const lines = text
    .split(/\n+/)
    .map(clean)
    .filter(Boolean)
  const seen = new Set<string>()
  const out: string[] = []
  const push = (block: string) => {
    for (const part of block.split(/(?<=[.!?])\s+(?=["“'(\[]?[\p{Lu}\p{N}])/u)) {
      const s = part.trim()
      if (wordCount(s) < 6) continue
      const key = s.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      out.push(s)
    }
  }

  let cur = ''
  const flush = () => {
    if (cur) push(cur)
    cur = ''
  }
  for (const line of lines) {
    if (isHeading(line)) {
      flush()
      continue
    }
    if (!cur) cur = line
    else if (/[.!?]$/.test(cur)) {
      flush()
      cur = line
    } else cur += ' ' + line
  }
  flush()
  return out
}

/** Content words by frequency, ties broken by first appearance. */
function rankTerms(sentences: string[]): { term: string; freq: number; first: number }[] {
  const freq = new Map<string, { term: string; freq: number; first: number }>()
  let i = 0
  for (const s of sentences) {
    for (const term of wordsOf(s)) {
      if (STOP.has(term) || term.length < 4) continue
      const hit = freq.get(term)
      if (hit) hit.freq++
      else freq.set(term, { term, freq: 1, first: i++ })
    }
  }
  return [...freq.values()].sort((a, b) => b.freq - a.freq || a.first - b.first)
}

function pickTerms(sentences: string[], n: number): string[] {
  const ranked = rankTerms(sentences)
  const strong = ranked.filter((t) => t.freq > 1)
  return (strong.length >= 4 ? strong : ranked).slice(0, n).map((t) => t.term)
}

type Ranked = { text: string; at: number; score: number; words: Set<string> }

/** Sentences that best cover the document's frequent words, best first. */
function rankSentences(sentences: string[], terms: string[]): Ranked[] {
  const weight = new Map(terms.map((t, i) => [t, terms.length - i]))
  return sentences
    .map((s, at) => {
      const words = new Set(wordsOf(s))
      let score = 0
      for (const w of words) score += weight.get(w) ?? 0
      if (terms.slice(0, 3).some((t) => words.has(t))) score += 4
      return { text: s, at, score: score / Math.sqrt(wordCount(s)), words }
    })
    .sort((a, b) => b.score - a.score || a.at - b.at)
}

export const SUBJECTS: [RegExp, string][] = [
  [/cell|biolog|organ|enzyme|photosynth|dna|gene|protein|species/i, 'Biology'],
  [/histor|revolution|empire|treaty|medieval|century|renaissance|baroque/i, 'History'],
  [/deriv|integr|algebra|calcul|theorem|geometry|equation/i, 'Maths'],
  [/supply|demand|economics|market|inflation|elastic|gdp/i, 'Economics'],
  [/chemist|reaction|molecul|acid|compound|electron/i, 'Chemistry'],
  [/physic|force|energy|velocity|circuit|momentum/i, 'Physics'],
  [/algorithm|program|comput|software|database|compiler/i, 'Computer science'],
  [/psycholog|behavio|cognitive|memory|stimulus/i, 'Psychology'],
  [/legal|statute|court|contract|tort\b|jurisdiction/i, 'Law'],
]

/** Subjects offered when a student edits a file's subject; the last is the fallback. */
export const SUBJECT_NAMES = [...SUBJECTS.map(([, name]) => name), 'Study notes']

function guessSubject(text: string): string {
  let best = { subject: 'Study notes', hits: 0 }
  for (const [re, subject] of SUBJECTS) {
    const hits = text.match(new RegExp(re.source, 'gi'))?.length ?? 0
    if (hits > best.hits) best = { subject, hits }
  }
  return best.subject
}

function titleFrom(name: string): string {
  const base = clean(name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '))
  return base ? cap(base) : 'Your file'
}

/** Put **bold** around the first mention of a term, keeping its original case. */
function bold(term: string, sentence: string): string {
  const at = term ? sentence.toLowerCase().indexOf(term.toLowerCase()) : -1
  if (at < 0) return sentence
  return sentence.slice(0, at) + '**' + sentence.slice(at, at + term.length) + '**' + sentence.slice(at + term.length)
}

const DEF = /^(?:the\s+)?([\p{Lu}\p{L}][\p{L}\d\s'-]{2,40}?)\s+(is|are|means|refers to|describes|is defined as)\s+([^.;:]{20,200})/u
const SKIP = /^(it|this|that|these|those|there|they|he|she|we|you|i|which|who)\b/i

/** Up to `limit` cards, each from a different sentence: definitions, key terms, then clozes. */
function cardsFrom(ranked: Ranked[], terms: string[], limit: number): Card[] {
  const cards: Card[] = []
  const used = new Set<number>()
  const fronts = new Set<string>()
  const add = (front: string, back: string) => {
    if (fronts.has(front.toLowerCase()) || cards.length >= limit) return
    fronts.add(front.toLowerCase())
    cards.push({ id: `c${cards.length + 1}`, front, back })
  }

  // 1. "X is Y" sentences become real definition questions.
  for (const r of ranked) {
    if (cards.length >= limit) break
    const m = r.text.match(DEF)
    if (!m || used.has(r.at) || SKIP.test(m[1])) continue
    const subject = m[1].trim().replace(/^(the|a|an)\s+/i, '')
    if (wordCount(subject) > 5) continue
    used.add(r.at)
    const back = clip(cap(m[3].trim()), 180)
    add(`${m[2].toLowerCase() === 'are' ? 'What are' : 'What is'} ${subject}?`, /[.!?…]$/.test(back) ? back : back + '.')
  }

  // 2. One card per key term, from the best sentence about it that nothing else used.
  let n = 0
  for (const term of terms) {
    if (cards.length >= limit) break
    const hit = ranked.find((r) => !used.has(r.at) && r.words.has(term))
    if (!hit) continue
    used.add(hit.at)
    add(`${n++ % 2 ? 'How does your file explain' : 'What does your file say about'} “${term}”?`, clip(hit.text, 200))
  }

  // 3. Fill in the blank for whatever sentences are left.
  for (const r of ranked) {
    if (cards.length >= limit) break
    if (used.has(r.at)) continue
    const term = terms.find((t) => r.words.has(t))
    if (!term) continue
    used.add(r.at)
    add(`Fill in the blank: “${clip(r.text.replace(new RegExp(term, 'i'), '＿＿＿'), 190)}”`, term)
  }

  return cards
}

/** Up to `limit` cloze questions, each from a different sentence and key term. */
function quizFrom(ranked: Ranked[], terms: string[], limit: number): Question[] {
  const quiz: Question[] = []
  const used = new Set<number>()
  const asked = new Set<string>()
  for (const r of ranked) {
    if (quiz.length >= limit) break
    if (used.has(r.at)) continue
    const term = terms.find((t) => r.words.has(t) && !asked.has(t))
    if (!term) continue
    const distractors = terms.filter((t) => t !== term).slice(0, 3)
    if (distractors.length < 3) break
    used.add(r.at)
    asked.add(term)
    const options: string[] = []
    const answer = quiz.length % 4
    let d = 0
    for (let i = 0; i < 4; i++) options.push(i === answer ? term : distractors[d++])
    quiz.push({
      id: `q${quiz.length + 1}`,
      prompt: `Complete the sentence: “${clip(r.text.replace(new RegExp(term, 'i'), '＿＿＿'), 220)}”`,
      options,
      answer,
      why: `Your file says: “${clip(r.text, 220)}”`,
    })
  }
  return quiz
}

function answersFrom(ranked: Ranked[], terms: string[], summary: string, keyPoints: string[], pages: number, title: string): Answer[] {
  const pageOf = (sentence: string) => {
    const all = ranked.map((r) => r.text).join(' ')
    const at = all.indexOf(sentence)
    const ratio = at < 0 ? 0 : at / Math.max(1, all.length)
    return `p. ${Math.max(1, Math.round(ratio * pages))}`
  }

  const answers: Answer[] = [
    {
      keywords: ['summary', 'summarise', 'summarize', 'overview', 'tldr', 'key points', 'main idea', 'about this', 'what is this'],
      text: `${summary}\n\nKey points:\n${keyPoints.map((k) => `- ${k}`).join('\n')}`,
      cite: 'p. 1',
    },
  ]

  // One answer per key sentence, findable by the words that sentence is about.
  for (const r of ranked.slice(0, 10)) {
    const keywords = [...r.words].filter((w) => !STOP.has(w) && w.length > 3).slice(0, 6)
    if (!keywords.length) continue
    const focus = terms.find((t) => r.words.has(t)) ?? keywords[0]
    answers.push({ keywords, text: bold(focus, clip(r.text, 320)), cite: pageOf(r.text) })
  }

  // Always keep a usable fallback, even for a very terse document.
  if (answers.length < 2) {
    answers.push({ keywords: ['explain', 'more', 'detail'], text: `Here is what **${title}** covers: ${clip(summary, 300)}`, cite: 'p. 1' })
  }
  return answers
}

/** Turn a document's text into the pack the app studies from. */
export function buildPack(text: string, name: string): Pack {
  const sentences = sentencesOf(text)
  const terms = pickTerms(sentences, 12)
  const ranked = rankSentences(sentences, terms)
  const title = titleFrom(name)
  const pages = Math.max(1, Math.ceil(wordCount(clean(text)) / 450))
  const summary = clip(ranked.slice(0, 2).map((r) => r.text).join(' '), 420)
  const keyPoints = ranked.slice(0, 4).map((r) => clip(r.text, 190))
  const cards = cardsFrom(ranked, terms, 8)
  const quiz = quizFrom(ranked, terms, 5)
  const suggestions = [
    `Summarise ${title}`,
    terms[0] ? `Explain ${terms[0]}` : 'What are the key points?',
    terms[1] ? `Explain ${terms[1]}` : 'What should I revise first?',
  ]

  return {
    id: 'generated',
    subject: guessSubject(text),
    title,
    pages,
    summary,
    keyPoints,
    suggestions,
    answers: answersFrom(ranked, terms, summary, keyPoints, pages, title),
    cards,
    quiz,
  }
}
