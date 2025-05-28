import MainLayout from '@/components/MainLayout'

import { cn } from '@/utils'
import { ILayoutComponentProps } from '@dvcorg/gatsby-theme/src/components/MainLayout'

import PageContent from '../PageContent'

import * as styles from './styles.module.css'

const Layout = ({ children, ...restProps }: ILayoutComponentProps) => (
  <MainLayout {...restProps}>
    <PageContent className={cn(styles.layoutBlog, 'mt-20')}>
      {children}
    </PageContent>
  </MainLayout>
)

export default Layout
