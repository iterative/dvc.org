import React, { Reducer, useReducer } from 'react'
import cn from 'classnames'
import { AsciinemaPlayer } from '../../AsciinemaPlayer'

const items = [
  {
    title: 'Connect storage to repo',
    description:
      'Keep large data and model files alongside code and share via your cloud storage.',
    terminal: `remote`
  },
  {
    title: 'Configure steps as you go',
    description:
      'Declare dependencies and outputs at each step to build reproducible end-to-end pipelines.',
    terminal: `pull`
  },
  {
    title: 'Track experiments in Git',
    description:
      'Track experiments in your repo, compare results and restore entire experiment states cross-team.',
    terminal: `expshow`
  }
]

const Terminal = ({ src, onEnded }: { src: string; onEnded: () => void }) => {
  return (
    <div className={cn('sm:w-7/12', 'shrink-0')}>
      <AsciinemaPlayer
        src={`/asciinema/${src}.cast`}
        autoPlay={true}
        onEnded={onEnded}
      />
    </div>
  )
}

const LandingHero = () => {
  const [{ currentIndex }, changeCurrentIndex] = useReducer<
    Reducer<{ currentIndex: number; paused: boolean }, number | undefined>
  >(
    (state, action) => {
      if (action === undefined) {
        const { currentIndex, paused } = state
        if (paused) {
          return state
        } else {
          return {
            currentIndex:
              currentIndex === items.length - 1 ? 0 : currentIndex + 1,
            paused: false
          }
        }
      } else {
        return {
          currentIndex: action,
          paused: true
        }
      }
    },
    { currentIndex: 0, paused: false }
  )

  return (
    <div>
      <h1 className={cn('text-4xl', 'font-bold', 'mt-4', 'mb-8')}>
        (Not Just) Data Version Control
      </h1>
      <div className={cn('flex', 'flex-col', 'sm:flex-row-reverse', 'my-8')}>
        <Terminal
          src={items[currentIndex].terminal}
          onEnded={() => {
            window.setTimeout(() => {
              changeCurrentIndex(undefined)
            }, 1000)
          }}
        />
        <ul className={cn('flex', 'flex-col')}>
          {items.map(({ title, description }, i) => {
            return (
              <li key={i}>
                <button
                  onClick={() => {
                    changeCurrentIndex(i)
                  }}
                >
                  <h2 className={cn('text-lg', 'font-semibold')}>{title}</h2>
                  <p
                    className={cn(
                      'overflow-hidden',
                      i === currentIndex ? 'h-8' : 'h-0'
                    )}
                  >
                    {description}
                  </p>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default LandingHero
