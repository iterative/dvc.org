import React, { useEffect } from 'react'
import { SkipNavContent, SkipNavLink } from '@reach/skip-nav'
import '@reach/skip-nav/styles.css'

import { IPageProps } from '../Page'
import LayoutHeader from '../LayoutHeader'
import LayoutFooter from '../LayoutFooter'
import { handleFirstTab } from 'gatsby-theme-iterative-docs/src/utils/front/accessibility'

import * as styles from './styles.module.css'
import { logEvent } from 'gatsby-theme-iterative-docs/src/utils/front/plausible'
import { useLocation } from '@reach/router'

export enum LayoutModifiers {
  Wide,
  Collapsed,
  HideAlert
}

export interface ILayoutModifiable {
  modifiers?: Array<LayoutModifiers>
}

interface IMainLayoutProps {
  className?: string
}

export type LayoutComponent = React.FC<
  IMainLayoutProps & IPageProps & ILayoutModifiable
>

const MainLayout: LayoutComponent = ({
  className,
  children,
  modifiers = [],
  pageContext
}) => {
  const location = useLocation()
  useEffect(() => {
    if (className) {
      document.body.classList.add(className)

      return (): void => {
        document.body.classList.remove(className)
      }
    }
  }, [className])

  useEffect(() => {
    document.body.classList.add(styles.mainLayout)
    window.addEventListener('keydown', handleFirstTab)

    return (): void => {
      window.removeEventListener('keydown', handleFirstTab)
    }
  }, [])

  return (
    <>
      <SkipNavLink
        contentId="main-content"
        className={styles.skipLink}
        onClick={() => {
          logEvent('Skip To Content', { path: location.pathname })
        }}
      />
      <LayoutHeader modifiers={modifiers} />
      <div
        id="layoutContent"
        //  className={styles.pageContent}
      >
        {!pageContext.isDocs && <SkipNavContent id="main-content" />}
        {children}
      </div>
      <LayoutFooter />
    </>
  )
}

export default MainLayout
