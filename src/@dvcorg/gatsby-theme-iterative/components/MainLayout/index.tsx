import React, { useEffect } from 'react'
import { SkipNavContent, SkipNavLink } from '@reach/skip-nav'
import '@reach/skip-nav/styles.css'

import { LayoutComponent } from '@dvcorg/gatsby-theme-iterative/src/components/MainLayout'
import LayoutHeader from '../LayoutHeader'
import LayoutFooter from '../LayoutFooter'
import { handleFirstTab } from '@dvcorg/gatsby-theme-iterative/src/utils/front/accessibility'

import * as styles from './styles.module.css'
import { logEvent } from '@dvcorg/gatsby-theme-iterative/src/utils/front/plausible'
import { useLocation } from '@reach/router'

export * from '@dvcorg/gatsby-theme-iterative/src/components/MainLayout'

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
    <div className={styles.wrapper}>
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
    </div>
  )
}

export default MainLayout
