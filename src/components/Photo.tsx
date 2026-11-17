import { useState } from 'react'
import type { ImgHTMLAttributes } from 'react'

import { cx } from '../lib/cx'

/** An image that fades in once decoded, over a quiet placeholder. */
export function Photo({ className, alt, eager, ...rest }: ImgHTMLAttributes<HTMLImageElement> & { alt: string; eager?: boolean }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      onLoad={() => setLoaded(true)}
      className={cx('transition-opacity duration-700', loaded ? 'opacity-100' : 'opacity-0', className)}
      {...rest}
    />
  )
}
