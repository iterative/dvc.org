import React from 'react'
import MainLayout, { LayoutComponent, LayoutModifiers } from '../MainLayout'

const alertComponentModifiers: LayoutModifiers[] = [
  LayoutModifiers.Collapsed,
  LayoutModifiers.HideAlert
]

const AlertLandingLayout: LayoutComponent = props => {
  const modifiers: LayoutModifiers[] =
    props.modifiers === undefined
      ? alertComponentModifiers
      : alertComponentModifiers.concat(props.modifiers)
  return <MainLayout {...props} modifiers={modifiers} />
}

export default AlertLandingLayout
