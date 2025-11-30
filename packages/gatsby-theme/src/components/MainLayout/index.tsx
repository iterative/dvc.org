import cn from 'classnames'
import { PageProps } from 'gatsby'
import { ReactNode, useEffect } from 'react'

import 'reset-css'
import './base.css'
import './fonts.css'
import { handleFirstTab } from '../../utils/front/accessibility'
import LayoutFooter from '../LayoutFooter'
import LayoutHeader from '../LayoutHeader'
import SEO, { ISEOProps } from '../SEO'

import { useRedirects } from './utils'

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
  seo?: ISEOProps
}

const MainLayout = ({
  className,
  children,
  modifiers = [],
  location,
  seo
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
      <SEO
        title={seo?.title}
        description={seo?.description}
        pathname={seo?.pathname ?? location.pathname}
      />
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
