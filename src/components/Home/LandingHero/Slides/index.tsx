import React, { Reducer, useCallback, useMemo, useReducer } from 'react'
import cn from 'classnames'
import { MemoizedTypedTerminal } from '../Typed'
import { graphql, useStaticQuery } from 'gatsby'

interface ILandingPageSlide {
  title: string
  description: string
  terminal: string
}

export const HeroSlides = () => {
  const {
    landingPage: { slides }
  } = useStaticQuery(graphql`
    query {
      landingPage {
        slides {
          title
          description
          terminal
        }
      }
    }
  `) as {
    landingPage: {
      slides: ILandingPageSlide[]
    }
  }

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
              currentIndex === slides.length - 1 ? 0 : currentIndex + 1,
            paused: false
          }
        }
      } else {
        if (state.paused && state.currentIndex === action) {
          return state
        }
        return {
          currentIndex: action,
          paused: true
        }
      }
    },
    { currentIndex: 0, paused: false }
  )

  const { terminal } = slides[currentIndex]

  const onComplete = useCallback(
    () =>
      window.setTimeout(() => {
        changeCurrentIndex(undefined)
      }, 2000),
    [changeCurrentIndex]
  )

  const typedOptions = useMemo(() => {
    return {
      typeSpeed: 20,
      strings: Array.isArray(terminal) ? terminal : [terminal],
      onComplete
    }
  }, [terminal, currentIndex, onComplete])

  return (
    <div className={cn('flex', 'flex-col', 'md:flex-row-reverse', 'my-8')}>
      <div
        className={cn(
          'my-4',
          'rounded-lg',
          'bg-white',
          'drop-shadow',
          'h-64',
          'mx-auto',
          'max-w-full',
          'text-[10px]',
          'overflow-auto',
          'shrink-0',
          'w-[469px]',
          'sm:w-[564px]',
          'sm:text-[12px]',
          'md:w-[469px]',
          'md:text-[10px]',
          'lg:w-[564px]',
          'lg:text-[12px]'
        )}
      >
        <div className={cn('leading-4', 'm-3', 'inline-block')}>
          <MemoizedTypedTerminal typedOptions={typedOptions} />
        </div>
      </div>
      <ul className={cn('flex', 'flex-col', 'justify-center')}>
        {slides.map(({ title, description }, i) => {
          const active = currentIndex === i
          return (
            <li key={i}>
              <button
                className={cn(
                  'text-left',
                  'px-3',
                  'py-1',
                  'my-1',
                  'flex',
                  'flex-col',
                  'flex-nowrap',
                  'justify-center',
                  'md:pl-4',
                  active && ['border-l-2', 'border-sky-500']
                )}
                onClick={() => {
                  changeCurrentIndex(i)
                }}
              >
                <h2 className={cn('text-2xl', 'font-medium')}>{title}</h2>
                <p
                  className={cn(
                    'mt-2',
                    'ease-in-out',
                    'duration-300',
                    'overflow-hidden',
                    i === currentIndex ? 'max-h-12' : 'max-h-0'
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
  )
}
