import React from 'react'
import cn from 'classnames'
import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'

export const AlertContent = () => (
  <div
    className={cn(
      'p-1',
      'w-full',
      'whitespace-nowrap',
      'overflow-hidden',
      'truncate'
    )}
  >
    <span role="img" aria-label="rocket">
      🚀
    </span>{' '}
    New Release!{' '}
    <Link href="https://dvc.org/blog/iterative-studio-model-registry">
      Git-backed Machine Learning Model Registry
    </Link>{' '}
    for all your model management needs.
  </div>
)
