import React, { useEffect } from 'react'

import { IPageProps } from '../Page'
import LayoutHeader from '../LayoutHeader'
import HamburgerMenu from '../HamburgerMenu'
import LayoutFooter from '../LayoutFooter'

import styles from './styles.module.css'

export enum LayoutModifiers {
  Wide,
  Collapsed
}

export interface ILayoutModifiable {
  modifiers?: Array<LayoutModifiers>
}

interface IMainLayoutProps {
  className?: string
}

export type LayoutComponent = React.SFC<
  IMainLayoutProps & IPageProps & ILayoutModifiable
>

const MainLayout: LayoutComponent = ({
  className,
  children,
  modifiers = []
}) => {
  useEffect(() => {
    document.body.classList.add(styles.mainLayout)
  }, [])
  useEffect(() => {
    if (className) {
      document.body.classList.add(className)

      return () => {
        document.body.classList.remove(className)
      }
    }
  }, [className])

  return (
    <>
      <LayoutHeader modifiers={modifiers} />
      <HamburgerMenu />
      {children}
      <LayoutFooter modifiers={modifiers} />
    </>
  )
}

export default MainLayout
