import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { Check } from 'lucide-react'

import { cx } from '../lib/cx'
import type { Force } from './Button'

type Wrap = { label: string; hint?: string; error?: string | null; className?: string; force?: Force; hideLabel?: boolean }

function Shell({ id, label, hint, error, className, hideLabel, children }: Wrap & { id: string; children: ReactNode }) {
  return (
    <div className={cx('grid gap-2', className)}>
      <label htmlFor={id} className={cx('text-[13.5px] font-medium text-soft', hideLabel && 'sr-only')}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-msg`} className="text-[13px] text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-msg`} className="text-[13px] text-faint">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

function aria(id: string, error?: string | null, hint?: string) {
  return { 'aria-invalid': error ? true : undefined, 'aria-describedby': error || hint ? `${id}-msg` : undefined } as const
}

export function Input({ label, hint, error, className, force, hideLabel, id: given, ...rest }: Wrap & InputHTMLAttributes<HTMLInputElement>) {
  const auto = useId()
  const id = given ?? auto
  return (
    <Shell id={id} label={label} hint={hint} error={error} className={className} hideLabel={hideLabel}>
      <input id={id} data-force={force} className="field" {...aria(id, error, hint)} {...rest} />
    </Shell>
  )
}

export function Textarea({ label, hint, error, className, force, hideLabel, id: given, ...rest }: Wrap & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const auto = useId()
  const id = given ?? auto
  return (
    <Shell id={id} label={label} hint={hint} error={error} className={className} hideLabel={hideLabel}>
      <textarea id={id} data-force={force} className="field" {...aria(id, error, hint)} {...rest} />
    </Shell>
  )
}

export function Select({ label, hint, error, className, force, hideLabel, id: given, children, ...rest }: Wrap & SelectHTMLAttributes<HTMLSelectElement>) {
  const auto = useId()
  const id = given ?? auto
  return (
    <Shell id={id} label={label} hint={hint} error={error} className={className} hideLabel={hideLabel}>
      <select id={id} data-force={force} className="field" {...aria(id, error, hint)} {...rest}>
        {children}
      </select>
    </Shell>
  )
}

export function Checkbox({ label, error, className, id: given, ...rest }: { label: ReactNode; error?: string | null; className?: string } & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  const auto = useId()
  const id = given ?? auto
  return (
    <div className={cx('grid gap-1.5', className)}>
      <label htmlFor={id} className="group flex cursor-pointer items-start gap-3 text-[14px] text-soft">
        <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
          <input
            id={id}
            type="checkbox"
            className="peer absolute inset-0 cursor-pointer appearance-none rounded-[7px] border border-line-strong bg-white/4 transition-colors checked:border-leaf checked:bg-leaf focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf aria-[invalid=true]:border-danger"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-msg` : undefined}
            {...rest}
          />
          <Check aria-hidden className="pointer-events-none relative size-3.5 text-ink opacity-0 peer-checked:opacity-100" strokeWidth={3} />
        </span>
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${id}-msg`} className="pl-8 text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
