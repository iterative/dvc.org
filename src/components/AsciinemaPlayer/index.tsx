import React, { useEffect, useRef } from 'react'
import * as AsciinemaPlayerLibrary from 'asciinema-player'
import 'asciinema-player/dist/bundle/asciinema-player.css'

type AsciinemaPlayerProps = {
  src: string
  className?: string
  onEnded?: () => void
  asciinemaOptions?: {
    cols?: string
    rows?: string
    autoPlay?: boolean
    preload?: boolean
    loop?: boolean | number
    startAt?: number | string
    speed?: number
    idleTimeLimit?: number
    theme?: string
    poster?: string
    fit?: string
    fontSize?: string
  }
}

export const AsciinemaPlayer: React.FC<AsciinemaPlayerProps> = ({
  src,
  onEnded,
  className,
  asciinemaOptions
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentRef = ref.current
    const player = AsciinemaPlayerLibrary.create(
      src,
      currentRef,
      asciinemaOptions
    )
    if (onEnded) {
      player.addEventListener('ended', onEnded)
    }
    return () => {
      player.dispose()
    }
  }, [src])

  return <div className={className} ref={ref} />
}

export default AsciinemaPlayer
