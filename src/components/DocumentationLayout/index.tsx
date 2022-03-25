import React from 'react'
import { SkipNavContent, SkipNavLink } from '@reach/skip-nav'
import '@reach/skip-nav/styles.css'

import MainLayout, { LayoutComponent, LayoutModifiers } from '../MainLayout'
import ThemeDocumentationLayout from 'gatsby-theme-iterative-docs/src/components/Documentation/Layout'
import * as styles from './styles.module.css'

const Layout: LayoutComponent = ({ children, ...restProps }) => {
  const {
    location: { pathname }
  } = restProps

  return (
    <>
      <SkipNavLink contentId="main-content" className={styles.skipLink} />
      <MainLayout
        {...restProps}
        modifiers={[LayoutModifiers.Wide, LayoutModifiers.Collapsed]}
      >
        <ThemeDocumentationLayout currentPath={pathname}>
          <SkipNavContent id="main-content" />
          {children}
        </ThemeDocumentationLayout>
      </MainLayout>
    </>
  )
}

export default Layout
