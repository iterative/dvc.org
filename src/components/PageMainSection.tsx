import { HTMLAttributes, ReactNode } from 'react'

import Spacer from './Spacer'

interface PageMainSectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  className?: string
  spacer?: boolean
}

const PageMainSection = ({
  className,
  children,
  spacer = true,
  ...props
}: PageMainSectionProps) => {
  return (
    <>
      <main className={className} {...props}>
        {children}
      </main>
      {spacer && <Spacer />}
    </>
  )
}

export default PageMainSection
