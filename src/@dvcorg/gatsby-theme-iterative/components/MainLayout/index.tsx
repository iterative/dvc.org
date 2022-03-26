import React, { useEffect } from 'react'

import { LayoutComponent } from '@dvcorg/gatsby-theme-iterative/src/components/MainLayout'
import LayoutHeader from '../LayoutHeader'
import LayoutFooter from '../LayoutFooter'
import { handleFirstTab } from '@dvcorg/gatsby-theme-iterative/src/utils/front/accessibility'

import * as styles from './styles.module.css'

export {
  LayoutComponent,
  LayoutModifiers
} from '@dvcorg/gatsby-theme-iterative/src/components/MainLayout'

const MainLayout: LayoutComponent = ({
  className,
  children,
  modifiers = []
}) => {
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
      <LayoutHeader modifiers={modifiers} />
      <div
        id="layoutContent"
        //  className={styles.pageContent}
      >
        {children}
      </div>
      <LayoutFooter />
    </>
  )
}

export default MainLayout
