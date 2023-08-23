import React from 'react'
import cn from 'classnames'

import * as styles from './styles.module.css'
import CompanyLogos from './CompanyLogos'

const CompanySlider = () => {
  return (
    <div className="mt-10">
      <div className="mb-2">
        <h2 className={cn('text-2xl font-medium text-center', styles.title)}>
          Empowering thousands of users and customers from startups to Fortune
          500 companies
        </h2>
      </div>
      <div
        className={cn(
          'mb-2 w-full grid place-items-center overflow-hidden relative',
          styles.fade
        )}
      >
        <div className="flex justify-between gap-8 animate-slide group">
          <CompanyLogos />
          <CompanyLogos />
          <CompanyLogos />
          <CompanyLogos />
        </div>
      </div>
    </div>
  )
}

export default CompanySlider
