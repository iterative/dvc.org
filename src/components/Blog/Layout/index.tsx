import { ILayoutComponentProps } from '@dvcorg/gatsby-theme-iterative/src/components/MainLayout'

import MainLayout from '@/components/MainLayout'

import { cn } from '@/utils'

import * as styles from './styles.module.css'

const Layout = ({ children, ...restProps }: ILayoutComponentProps) => (
  <MainLayout {...restProps} className={cn(styles.layoutBlog, 'mt-16')}>
    {children}
  </MainLayout>
)

export default Layout
