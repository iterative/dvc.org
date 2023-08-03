import cn from 'classnames'
import React from 'react'

import * as styles from './styles.module.css'

const HeroTitleSection = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <div
        className={cn(
          'text-center',
          'px-6 py-10 md:py-24',
          'flex flex-col gap-6 md:flex-row md:gap-0 items-center',
          'max-w-screen-lg'
        )}
      >
        <div
          className={cn(
            'text-indigo',
            'flex-1',
            'md:border-r-2 md:border-solid md:border-r-light',
            'md:text-left',
            'lg:pr-16'
          )}
        >
          <h1 className={cn('font-extralight', styles.title)}>
            <span className="font-medium block sm:inline md:block">
              Data Version Control
            </span>{' '}
            for the <span className="font-medium">GenAI</span> era
          </h1>
          <p className="text-2xl mt-4 leading-normal">
            Free and open source, forever.
          </p>
        </div>
        <div className={cn('flex-1', 'md:text-justify', 'lg:pl-16')}>
          <p className="text-xl font-extralight md:pl-8 lg:pl-0 leading-10">
            Manage and version unstructured image, audio, video, and text files
            in storage and organize your ML modeling process into a reproducible
            workflow.
          </p>
        </div>
      </div>
    </div>
  )
}

export default HeroTitleSection
