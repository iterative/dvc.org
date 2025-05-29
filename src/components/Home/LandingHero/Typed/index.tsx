import cn from 'classnames'
import { useEffect, useRef, memo } from 'react'
import Typed, { TypedOptions } from 'typed.js'

import * as codeStyles from '@dvcorg/gatsby-theme/src/components/Documentation/Markdown/Main/theme.module.css'

export const TypedTerminal = ({
  typedOptions,
  className
}: {
  typedOptions: TypedOptions
  className?: string
}) => {
  const el = useRef<HTMLPreElement | null>(null)
  const typed = useRef<Typed | null>(null)

  useEffect(() => {
    if (el.current) {
      typed.current = new Typed(el.current, typedOptions)

      return () => {
        typed.current?.destroy()
      }
    }
  }, [typedOptions])

  return <pre className={cn(className, codeStyles.code)} ref={el} />
}

export const MemoizedTypedTerminal = memo(TypedTerminal)
