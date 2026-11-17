import { useEffect, useState } from 'react'
import { ArrowRight, Check, CircleCheck, CircleX, ListChecks, RotateCcw, X } from 'lucide-react'

import { Badge } from '../../components/Badge'
import { Button, ButtonLink } from '../../components/Button'
import { Notice } from '../../components/Notice'
import { ProgressBar, ScoreRing } from '../../components/Progress'
import { cx } from '../../lib/cx'
import { markStudied, packOf, useAttempts } from '../../lib/library'
import { AppHeader } from './AppHeader'
import { DocPicker } from './DocPicker'
import { NoDocs } from './NoDocs'
import { useActiveDoc } from './useActiveDoc'

type Phase = 'intro' | 'question' | 'results'
const LETTERS = ['A', 'B', 'C', 'D', 'E']

/** Multiple-choice practice test: one question at a time, feedback, then a score saved to history. */
export function QuizPage() {
  const [doc, docs, pick] = useActiveDoc()
  const [attempts, setAttempts] = useAttempts()
  const [phase, setPhase] = useState<Phase>('intro')
  const [i, setI] = useState(0)
  const [choice, setChoice] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [answers, setAnswers] = useState<number[]>([])
  const [nudge, setNudge] = useState(false)

  useEffect(() => {
    setPhase('intro')
  }, [doc?.id])

  if (!doc) return <NoDocs what="a practice quiz" />
  const pack = packOf(doc)
  const q = pack.quiz[i]
  const history = attempts.filter((a) => a.docId === doc.id)
  const best = history.reduce((m, a) => Math.max(m, a.score / a.total), -1)
  const score = answers.filter((a, n) => a === pack.quiz[n]?.answer).length

  const start = () => {
    setI(0)
    setChoice(null)
    setChecked(false)
    setAnswers([])
    setNudge(false)
    setPhase('question')
  }

  const check = () => {
    if (choice === null) return setNudge(true)
    setChecked(true)
    setAnswers((a) => [...a, choice])
  }

  const next = () => {
    if (i + 1 < pack.quiz.length) {
      setI(i + 1)
      setChoice(null)
      setChecked(false)
      return
    }
    const final = answers.filter((a, n) => a === pack.quiz[n].answer).length
    setAttempts((h) => [...h, { docId: doc.id, score: final, total: pack.quiz.length, at: new Date().toISOString() }].slice(-60))
    markStudied()
    setPhase('results')
  }

  return (
    <>
      <AppHeader title="Practice quiz" lede={`${pack.quiz.length} questions written from ${pack.title}.`}>
        <DocPicker doc={doc} docs={docs} onChange={pick} />
      </AppHeader>

      <div className="mx-auto grid max-w-3xl gap-6 px-5 py-8 sm:px-8 lg:py-12">
        {phase === 'intro' && (
          <div className="grid gap-6">
            <div className="glass rounded-[32px] p-7 sm:p-10">
              <span className="grid size-12 place-items-center rounded-2xl bg-leaf-soft text-leaf-text">
                <ListChecks aria-hidden className="size-6" />
              </span>
              <h2 className="mt-6 text-[clamp(26px,3vw,34px)] font-normal leading-tight tracking-[-0.04em]">{pack.title}</h2>
              <p className="mt-2 text-[15.5px] text-muted">
                {pack.quiz.length} multiple-choice questions, about {Math.max(2, Math.round(pack.quiz.length * 0.6))} minutes. Every answer comes with a short explanation.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge>{pack.subject}</Badge>
                {best >= 0 ? <Badge tone="leaf">Best score {Math.round(best * 100)}%</Badge> : <Badge>Not taken yet</Badge>}
              </div>
              <Button variant="paper" size="lg" className="mt-8" iconRight={<ArrowRight className="size-4" />} onClick={start}>
                {history.length ? 'Take it again' : 'Start quiz'}
              </Button>
            </div>
            {history.length > 0 && (
              <section aria-labelledby="hist-title">
                <h2 id="hist-title" className="text-[15px] font-medium text-soft">
                  Past attempts
                </h2>
                <ul className="mt-3 divide-y divide-line rounded-[22px] border border-line">
                  {[...history].reverse().slice(0, 5).map((a) => (
                    <li key={a.at} className="flex items-center justify-between px-5 py-3.5 text-[14.5px]">
                      <span className="text-muted">{new Date(a.at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      <span className="tabular-nums">
                        {a.score} of {a.total}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        {phase === 'question' && q && (
          <div className="grid gap-6">
            <div className="flex items-center gap-4">
              <ProgressBar label="Quiz progress" value={i + (checked ? 1 : 0)} max={pack.quiz.length} className="flex-1" />
              <span className="text-[13.5px] tabular-nums text-muted">
                Question {i + 1} of {pack.quiz.length}
              </span>
            </div>
            <fieldset key={q.id} className="glass animate-pop rounded-[32px] p-6 sm:p-9">
              <legend className="sr-only">{q.prompt}</legend>
              <p aria-hidden className="text-[clamp(22px,2.8vw,30px)] font-normal leading-snug tracking-[-0.03em]">
                {q.prompt}
              </p>
              <div className="mt-7 grid gap-2.5">
                {q.options.map((o, n) => {
                  const right = checked && n === q.answer
                  const wrong = checked && n === choice && n !== q.answer
                  return (
                    <label
                      key={o}
                      className={cx(
                        'flex min-h-14 cursor-pointer items-center gap-3.5 rounded-[18px] border px-4 py-3 text-[15.5px] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-leaf',
                        right ? 'border-leaf/60 bg-leaf-soft text-fg' : wrong ? 'border-danger/50 bg-danger-soft text-fg' : choice === n ? 'border-leaf/50 bg-white/8 text-fg' : 'border-line-strong bg-white/3 text-soft hover:border-leaf/30 hover:text-fg',
                        checked && 'cursor-default',
                      )}
                    >
                      <input type="radio" name={q.id} className="sr-only" checked={choice === n} disabled={checked} onChange={() => (setChoice(n), setNudge(false))} />
                      <span className={cx('grid size-8 shrink-0 place-items-center rounded-xl border text-[13px] font-medium', choice === n || right ? 'border-leaf/60 text-leaf-text' : 'border-line-strong text-muted')}>
                        {right ? <Check aria-hidden className="size-4" /> : wrong ? <X aria-hidden className="size-4 text-danger" /> : LETTERS[n]}
                      </span>
                      {o}
                    </label>
                  )
                })}
              </div>
              {checked && (
                <Notice tone={choice === q.answer ? 'success' : 'error'} className="mt-6">
                  <strong className="font-semibold">{choice === q.answer ? 'Correct.' : `Not quite: the answer is ${q.options[q.answer]}.`}</strong> {q.why}
                </Notice>
              )}
              {nudge && !checked && (
                <p role="alert" className="mt-4 text-[13.5px] text-danger">
                  Choose an answer first.
                </p>
              )}
            </fieldset>
            <div className="flex justify-end gap-2">
              {!checked ? (
                <Button variant="paper" size="lg" onClick={check}>
                  Check answer
                </Button>
              ) : (
                <Button variant="paper" size="lg" iconRight={<ArrowRight className="size-4" />} onClick={next}>
                  {i + 1 < pack.quiz.length ? 'Next question' : 'See my score'}
                </Button>
              )}
            </div>
          </div>
        )}

        {phase === 'results' && (
          <div className="grid gap-6">
            <div className="glass grid justify-items-center rounded-[32px] p-8 text-center sm:p-12">
              <ScoreRing value={score} max={pack.quiz.length} label={`You scored ${score} out of ${pack.quiz.length}`} />
              <h2 className="mt-6 text-[clamp(26px,3vw,34px)] font-normal tracking-[-0.04em]">
                {score === pack.quiz.length ? 'Perfect score' : score / pack.quiz.length >= 0.6 ? 'Nicely done' : 'Good start'}
              </h2>
              <p className="mt-2 max-w-md text-[15.5px] text-muted">
                {score === pack.quiz.length ? 'You know this file. Come back in a few days to make it stick.' : 'Review the questions you missed below, then try the flashcards for this file.'}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                <Button variant="glass" icon={<RotateCcw className="size-4" />} onClick={start}>
                  Retake quiz
                </Button>
                <ButtonLink href={`/app/flashcards?doc=${doc.id}`} variant="paper">
                  Review flashcards
                </ButtonLink>
              </div>
            </div>
            <section aria-labelledby="review-title">
              <h2 id="review-title" className="text-[15px] font-medium text-soft">
                Your answers
              </h2>
              <ol className="mt-3 grid gap-2.5">
                {pack.quiz.map((qq, n) => {
                  const ok = answers[n] === qq.answer
                  return (
                    <li key={qq.id} className="panel flex items-start gap-3 rounded-[20px] p-4">
                      {ok ? <CircleCheck aria-label="Correct" className="mt-0.5 size-5 shrink-0 text-leaf-text" /> : <CircleX aria-label="Incorrect" className="mt-0.5 size-5 shrink-0 text-danger" />}
                      <div className="text-[14.5px]">
                        <p className="text-fg">{qq.prompt}</p>
                        <p className="mt-1 text-muted">
                          {ok ? qq.options[qq.answer] : `You said ${qq.options[answers[n]] ?? 'nothing'}; answer: ${qq.options[qq.answer]}.`} {qq.why}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </section>
          </div>
        )}
      </div>
    </>
  )
}
