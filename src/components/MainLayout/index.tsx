import React from 'react'

import { IPageProps } from '../Page'
import LayoutHeader from '../LayoutHeader'
import HamburgerMenu from '../HamburgerMenu'
import LayoutFooter from '../LayoutFooter'

export enum LayoutModifiers {
  Wide,
  Scrolled
}

export interface ILayoutModifiable {
  modifiers?: Array<LayoutModifiers>
}

export type LayoutComponent = React.SFC<IPageProps & ILayoutModifiable>

const MainLayout: LayoutComponent = ({ children, modifiers = [] }) => {
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
