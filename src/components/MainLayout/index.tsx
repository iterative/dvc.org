import React from 'react'
import { PageProps } from 'gatsby'
import ThemeMainLayout, {
  ILayoutComponentProps
} from '@dvcorg/gatsby-theme-iterative/src/components/MainLayout'

interface IMainLayoutProps extends ILayoutComponentProps {
  location: PageProps['location']
}

const MainLayout = ({ children, ...props }: IMainLayoutProps) => {
  return (
    <ThemeMainLayout {...props} modifiers={[]}>
      {children}
    </ThemeMainLayout>
  )
}

export default MainLayout
