import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'

import { cx } from '../lib/cx'
import { Link } from '../lib/router'
import type { LinkProps } from '../lib/router'

export type Variant = 'paper' | 'leaf' | 'tint' | 'glass' | 'ghost' | 'danger'
export type Size = 'sm' | 'md' | 'lg' | 'xl'
export type Force = 'hover' | 'focus' | 'pressed'

type Common = { variant?: Variant; size?: Size; icon?: ReactNode; iconRight?: ReactNode; force?: Force; block?: boolean }

export function buttonClass({ variant = 'paper', size = 'md', block }: Pick<Common, 'variant' | 'size' | 'block'>, extra?: string) {
  return cx('btn', `btn-${variant}`, `btn-${size}`, block && 'w-full', extra)
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & Common & { loading?: boolean }

/** The one button. `loading` keeps the width and announces progress. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, icon, iconRight, force, block, loading, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      data-force={force}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClass({ variant, size, block }, className)}
      {...rest}
    >
      {loading ? <LoaderCircle aria-hidden className="size-4 animate-spin-slow" /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  )
})

export function ButtonLink({ variant, size, icon, iconRight, force, block, className, children, ...rest }: LinkProps & Common) {
  return (
    <Link data-force={force} className={buttonClass({ variant, size, block }, className)} {...rest}>
      {icon}
      {children}
      {iconRight}
    </Link>
  )
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { label: string; variant?: Variant; size?: 'sm' | 'md'; force?: Force }

/** Square icon-only button; `label` is its accessible name. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, variant = 'glass', size = 'md', force, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      data-force={force}
      className={cx('btn', `btn-${variant}`, size === 'sm' ? 'size-10' : 'size-11', '!p-0', className)}
      {...rest}
    >
      {children}
    </button>
  )
})
