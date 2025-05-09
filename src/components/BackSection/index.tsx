import { ReactNode } from 'react'

import { Button } from '@/components/base/button'
import Link from '@/components/Link'

import { cn } from '@/utils'

const BackSection = ({
  section,
  link,
  children
}: {
  section: 'top' | 'bottom'
  link: string
  children?: ReactNode
}) => {
  return (
    <section
      className={cn('pt-5', section === 'bottom' ? 'text-center' : 'text-left')}
    >
      <Button
        asChild
        rounded="full"
        size="lg"
        variant={section === 'bottom' ? 'outline' : 'link'}
        className="hover:no-underline"
      >
        <Link href={link} className="group">
          <span className="mr-1 transition-transform group-hover:-translate-x-1">
            &larr;
          </span>
          {` `}
          {children || `Back`}
        </Link>
      </Button>
    </section>
  )
}

export default BackSection
