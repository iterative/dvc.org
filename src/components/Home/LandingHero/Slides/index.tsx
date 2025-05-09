import cn from 'classnames'
import { Reducer, useCallback, useMemo, useReducer } from 'react'

import { MemoizedTypedTerminal } from '../Typed'

export interface ISlide {
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

const Slides = ({
  slides,
  terminalSide = 'right',
  theme = 'dark'
}: {
  slides: ISlide[]
  terminalSide?: 'right' | 'left'
  theme?: 'light' | 'dark'
}) => {
  const leftTerminal = terminalSide === 'left'
  const rightTerminal = terminalSide === 'right'
  const lightTheme = theme === 'light'
  const darkTheme = theme === 'dark'

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
      }, 2500),
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
    <div
      className={cn(
        'flex',
        'flex-col',
        {
          'md:flex-row': leftTerminal,
          'md:flex-row-reverse': rightTerminal
        },
        'my-6'
      )}
    >
      <div
        className={cn(
          'my-4',
          'rounded-lg',
          { 'bg-gray-dark': darkTheme, 'bg-light': lightTheme },
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
          'md:text-[10px]',
          {
            'md:mr-3': leftTerminal,
            'md:ml-3': rightTerminal
          }
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
            <li
              className={cn({
                'md:mr-3': leftTerminal,
                'md:ml-3': rightTerminal
              })}
              key={i}
            >
              <button
                className={cn(
                  'w-full',
                  'px-3 py-1',
                  'my-1',
                  'flex flex-col flex-nowrap justify-center',
                  'md:pl-4 md:py-2',
                  'border-l-2 text-left',
                  {
                    'md:border-l-0 md:border-r-2 md:text-right md:items-end':
                      leftTerminal
                  },
                  'ease-in-out',
                  'duration-300',
                  'hover:bg-light hover:bg-opacity-50',
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

export default Slides
