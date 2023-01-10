import React, { Reducer, useCallback, useMemo, useReducer } from 'react'
import cn from 'classnames'
import { MemoizedTypedTerminal } from './Typed'

const wrapOutputLine = (line: string) =>
  line.startsWith('$') ? line + '^250' : `\`${line}\``

const items = [
  {
    title: 'Connect storage to repo',
    description:
      'Keep large data and model files alongside code and share via your cloud storage.',
    terminal: `$ dvc add cats-dogs

$ dvc remote add storage s3://bucket/dvc-cache

$ dvc push
5000 files pushed
`
  },
  {
    title: 'Configure steps as you go',
    description:
      'Declare dependencies and outputs at each step to build reproducible end-to-end pipelines.',
    terminal: `$ dvc exp run
'data/data.xml.dvc' didn't change, skipping
Stage 'prepare' didn't change, skipping
Stage 'featurize' didn't change, skipping
Running stage 'train':
> python src/train.py data/features model.pkl
`
  },
  {
    title: 'Track experiments in Git',
    description:
      'Track experiments in your repo, compare results and restore entire experiment states cross-team.',
    terminal: `$ dvc exp show
──────────────────────────────────────────────────────────────────────────
  Experiment                avg_prec.test   roc_auc.test   train.min_split
──────────────────────────────────────────────────────────────────────────
  workspace                         0.925        0.94602   0.01
  main                              0.925        0.94602   0.01
  ├── 49dedc5 [exp-49cad]           0.925        0.94602   0.01
  ├── 701190a [exp-23adf]         0.92017        0.94309   0.02
  ├── cb3521f [exp-e77dd]         0.91783         0.9407   0.03
  ├── 29a4e00 [exp-5fe41]         0.91634        0.93989   0.04
  └── cb4fc16 [exp-61221]         0.91583        0.93979   0.05
──────────────────────────────────────────────────────────────────────────
`
  }
].map(item => {
  const { terminal } = item
  return {
    ...item,
    terminal: terminal.split('\n').map(wrapOutputLine).join('\n')
  }
})

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

  const { terminal } = items[currentIndex]

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
    <div>
      <h1 className={cn('text-4xl', 'font-bold', 'mt-4', 'mb-8')}>
        (Not Just) Data Version Control
      </h1>
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
            'w-[474px]',
            'text-[10px]',
            'sm:w-[564px]',
            'sm:text-[12px]',
            'md:w-[474px]',
            'md:text-[10px]',
            'lg:w-[564px]',
            'lg:text-[12px]',
            'overflow-auto',
            'shrink-0'
          )}
        >
          <div className={cn('leading-4', 'm-3', 'inline-block')}>
            <MemoizedTypedTerminal typedOptions={typedOptions} />
          </div>
        </div>
        <ul className={cn('flex', 'flex-col', 'justify-center')}>
          {items.map(({ title, description }, i) => {
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
                  <h2 className={cn('text-2xl', 'font-semibold')}>{title}</h2>
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
    </div>
  )
}

export default LandingHero
