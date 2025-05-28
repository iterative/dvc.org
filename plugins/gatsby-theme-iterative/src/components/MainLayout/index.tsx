import { ReactNode, useEffect } from 'react'
import { PageProps } from 'gatsby'
import cn from 'classnames'

import 'reset-css'
import './base.css'
import './fonts.css'
import LayoutHeader from '../LayoutHeader'
import LayoutFooter from '../LayoutFooter'
import { handleFirstTab } from '../../utils/front/accessibility'
import { useRedirects } from './utils'
import SEO from '../SEO'

export enum LayoutModifiers {
  Wide,
  Collapsed,
  HideAlert
}

export interface ILayoutModifiable {
  modifiers?: Array<LayoutModifiers>
}

export interface ILayoutComponentProps extends ILayoutModifiable {
  location: PageProps['location']
  className?: string
  children?: ReactNode
}

const MainLayout = ({
  className,
  children,
  modifiers = [],
  location
}: ILayoutComponentProps) => {
  useRedirects()

  useEffect(() => {
    window.addEventListener('keydown', handleFirstTab)

    return (): void => {
      window.removeEventListener('keydown', handleFirstTab)
    }
  }, [])

  return (
    <div
      className={cn(
        'min-h-screen',
        'w-full',
        'flex',
        'flex-col',
        'flex-nowrap',
        'items-center'
      )}
    >
      <SEO pathname={location.pathname} />
      <LayoutHeader modifiers={modifiers} />
      <main
        className={cn(
          'w-full',
          'grow',
          'flex',
          'flex-col',
          'flex-nowrap',
          'items-center',
          className
        )}
      >
        {children}
      </main>
      <LayoutFooter />
    </div>
  )
}

export default MainLayout
