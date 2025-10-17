import cn from 'classnames'
import { graphql, useStaticQuery } from 'gatsby'
import { Reducer, useCallback, useMemo, useReducer } from 'react'

import { MemoizedTypedTerminal } from '../Typed'

interface ILandingPageSlide {
  title: string
  description: string
  terminal: string
}

const TerminalButton = ({ color }: { color: string }) => (
  <span
    className={cn(
      'shrink-0',
      'mr-1',
      'inline-block',
      'rounded-full',
      'w-2',
      'h-2',
      color
    )}
  />
)

const TerminalButtons = () => (
  <div className={cn('h-4', 'px-2', 'pt-2', 'flex', 'flex-row', 'flex-nowrap')}>
    <TerminalButton color="bg-red-400" />
    <TerminalButton color="bg-yellow-300" />
    <TerminalButton color="bg-green-400" />
  </div>
)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminal, currentIndex, onComplete])

  return (
    <div className={cn('flex', 'flex-col', 'md:flex-row-reverse', 'my-6')}>
      <div
        className={cn(
          'my-4',
          'rounded-lg',
          'bg-gray-dark',
          'text-blue',
          'drop-shadow',
          'mx-auto',
          'max-w-full',
          'text-[10px]',
          'shrink-0',
          'w-[480px]',
          'sm:w-[570px]',
          'sm:text-[12px]',
          'md:w-[480px]',
          'md:text-[10px]'
        )}
      >
        <TerminalButtons />
        <div className={cn('leading-4', 'm-3', 'overflow-auto', 'h-56')}>
          <div className={cn('inline-block')}>
            <MemoizedTypedTerminal typedOptions={typedOptions} />
          </div>
        </div>
      </div>
      <ul className={cn('flex', 'flex-col', 'justify-center')}>
        {slides.map(({ title, description }, i) => {
          const active = currentIndex === i
          return (
            <li className={cn('md:mr-3')} key={i}>
              <button
                className={cn(
                  'w-full',
                  'text-left',
                  'px-3',
                  'py-1',
                  'my-1',
                  'flex',
                  'flex-col',
                  'flex-nowrap',
                  'justify-center',
                  'md:pl-4',
                  'md:py-2',
                  'border-l-2',
                  'ease-in-out',
                  'duration-300',
                  'hover:bg-gray-200',
                  active ? 'border-sky-500' : 'border-transparent'
                )}
                onClick={() => {
                  changeCurrentIndex(i)
                }}
              >
                <h2 className={cn('text-2xl', 'font-medium')}>{title}</h2>
                <p
                  className={cn(
                    'ease-in-out',
                    'duration-300',
                    'overflow-hidden',
                    i === currentIndex ? ['max-h-12', 'mt-2'] : 'max-h-0'
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
