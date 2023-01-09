import React, { Reducer, useEffect, useReducer } from 'react'
import cn from 'classnames'

const items = [
  {
    title: 'Connect storage to repo',
    description:
      'Keep large data and model files alongside code and share via your cloud storage.',
    terminal: `$ dvc add cats-dogs

$ dvc remote add storage s3://bucket/dvc-cache

$ dvc push
5000 files pushed`
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
> python src/train.py data/features model.pkl`
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
 ──────────────────────────────────────────────────────────────────────────`
  }
]

const Terminal = ({ data }) => {
  return (
    <div className={cn('sm:w-7/12', 'shrink-0')}>
      <pre
        className={cn(
          'block',
          'p-3',
          'border-black',
          'border-solid',
          'border',
          'text-xs',
          'mx-auto'
        )}
      >
        {data}
      </pre>
    </div>
  )
}

const LandingHero = () => {
  const [{ currentIndex, paused }, changeCurrentIndex] = useReducer<
    Reducer<{ currentIndex: number; paused: boolean }, number | undefined>
  >(
    ({ currentIndex }, action) =>
      action === undefined
        ? {
            currentIndex:
              currentIndex === items.length - 1 ? 0 : currentIndex + 1,
            paused: false
          }
        : {
            currentIndex: action,
            paused: true
          },
    { currentIndex: 0, paused: false }
  )

  useEffect(() => {
    if (!paused) {
      const interval = window.setInterval(() => {
        changeCurrentIndex(undefined)
      }, 3000)
      return () => window.clearInterval(interval)
    }
  }, [paused])

  return (
    <div>
      <h1 className={cn('text-4xl', 'font-bold', 'mt-4', 'mb-8')}>
        (Not Just) Data Version Control
      </h1>
      <div className={cn('flex', 'flex-col', 'sm:flex-row-reverse', 'my-8')}>
        <Terminal data={items[currentIndex].terminal} />
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
