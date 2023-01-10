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

  const { terminal } = items[currentIndex]

  return (
    <div>
      <h1 className={cn('text-4xl', 'font-bold', 'mt-4', 'mb-8')}>
        (Not Just) Data Version Control
      </h1>
      <div className={cn('flex', 'flex-col', 'sm:flex-row-reverse', 'my-8')}>
        <AsciinemaPlayer
          asciinemaOptions={{
            autoPlay: true,
            preload: true,
            cols: '67',
            rows: '15'
          }}
          className={cn('sm:w-7/12', 'shrink-0', 'h-full')}
          src={`/asciinema/${terminal}.cast`}
          onEnded={() => {
            window.setTimeout(() => {
              changeCurrentIndex(undefined)
            }, 1000)
          }}
        />
        <ul className={cn('flex', 'flex-col', 'justify-center')}>
          {items.map(({ title, description }, i) => {
            const active = currentIndex === i
            return (
              <li key={i}>
                <button
                  className={cn(
                    'text-left',
                    'pl-2',
                    'py-1',
                    'my-1',
                    'flex',
                    'flex-col',
                    'flex-nowrap',
                    'justify-center',
                    active && ['border-l-2', 'border-sky-500']
                  )}
                  onClick={() => {
                    changeCurrentIndex(i)
                  }}
                >
                  <h2 className={cn('text-2xl', 'font-semibold')}>{title}</h2>
                  <p
                    className={cn(
                      'mt-2',
                      'ease-in-out',
                      'duration-300',
                      'overflow-hidden',
                      i === currentIndex ? 'h-12' : 'h-0'
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
