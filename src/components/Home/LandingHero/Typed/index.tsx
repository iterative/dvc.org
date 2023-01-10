import React, { useEffect, useRef } from 'react'
import Typed, { TypedOptions } from 'typed.js'

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
  }, [typedOptions, el.current, typed.current])

  return <pre className={className} ref={el} />
}

export const MemoizedTypedTerminal = React.memo(TypedTerminal)
