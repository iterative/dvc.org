import React from 'react'

import MainLayout, { LayoutComponent, LayoutModifiers } from '../MainLayout'
import ThemeDocumentationLayout from 'gatsby-theme-iterative-docs/src/components/Documentation/Layout'

const Layout: LayoutComponent = ({ children, ...restProps }) => {
  const {
    location: { pathname }
  } = restProps

  return (
    <MainLayout
      {...restProps}
      modifiers={[LayoutModifiers.Wide, LayoutModifiers.Collapsed]}
    >
      <ThemeDocumentationLayout currentPath={pathname}>
        {children}
      </ThemeDocumentationLayout>
    </MainLayout>
  )
}

export default Layout
