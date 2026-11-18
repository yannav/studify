import { useId } from 'react'

import { useT } from '../lib/i18n'
import { SUBJECT_NAMES } from '../shared/analyze'
import { Input } from './Field'

/** Editable subject: free text, with the subjects the app knows as suggestions. */
export function SubjectField({ value, onChange, hint, className }: { value: string; onChange: (value: string) => void; hint?: string; className?: string }) {
  const t = useT()
  const id = useId()
  return (
    <>
      <Input
        label={t('Subject')}
        hint={hint}
        className={className}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        list={`${id}-subjects`}
        autoComplete="off"
        maxLength={40}
      />
      <datalist id={`${id}-subjects`}>
        {SUBJECT_NAMES.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </>
  )
}
