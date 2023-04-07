import React from 'react'
import cn from 'classnames'

import * as styles from './styles.module.css'
import CompanyLogos from './CompanyLogos'

const CompanySlider = () => {
  return (
    <div className="mt-10">
      <div className="mb-5">
        <h2 className={cn('text-2xl font-medium text-center', styles.title)}>
          Empowering from startups to Fortune 500 Companies: Our Open Source
          Tools at Work
        </h2>
      </div>
      <div
        className={cn(
          'max-w-[100vw] w-full grid place-items-center overflow-hidden relative',
          styles.fade
        )}
      >
        <div className="w-full animate-slide-fast md:animate-slide flex justify-center">
          <div className="inline-flex justify-between">
            <div className="inline-flex justify-between mt-1">
              <CompanyLogos />
            </div>
          </div>
          <div className="w-full inline-flex justify-between">
            <div className="inline-flex justify-between mt-1">
              <CompanyLogos />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanySlider
