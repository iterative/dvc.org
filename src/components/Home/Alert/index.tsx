import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import React from 'react'
import { cn } from '../../../utils'

const banner = {
  title:
    'Panel Discussion: Regulation and the need for Reproducibility and Standards in AI/ML',
  subtitle: 'Webinar | Wednesday, March 13th | 11 am ET',
  link: 'https://www.linkedin.com/events/regulationandtheneedforreproduc7170514648180482051/about/'
}

const Alert = () => (
  <>
    <div className={cn('py-2', 'bg-orange text-white', `w-full`)}>
      <div className="flex items-center gap-3 justify-center">
        <div className="text-right">
          <strong>{banner.title}</strong>
          <div>{banner.subtitle}</div>
        </div>
        <div>
          <Link
            href={banner.link}
            className={cn(
              'no-underline',
              'px-2 py-1',
              'rounded',
              'font-medium',
              'whitespace-nowrap',
              'bg-orange-50 text-orange-700',
              'hover:bg-white'
            )}
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  </>
)

export default Alert
