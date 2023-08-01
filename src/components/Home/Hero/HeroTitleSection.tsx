import cn from 'classnames'
import React from 'react'

import * as styles from './styles.module.css'

const HeroTitleSection = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <div className="px-6 py-10 flex flex-col gap-6 text-center">
        <div className="text-indigo">
          <h1 className={cn('leading-10 font-extralight', styles.title)}>
            <span className="font-medium block sm:inline md:block">
              Data Version Control
            </span>{' '}
            for the <span className="font-medium">GenAI</span> era
          </h1>
          <p className="text-2xl mt-2 leading-normal">
            Free and open source, forever.
          </p>
        </div>
        <div>
          <p className="text-xl font-extralight">
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
