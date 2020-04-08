import scroll from 'scroll'
import { useWindowScroll } from 'react-use'
export { default as ease } from 'ease-component'

import { getCustomProperty } from './customProperties'
import isClient from './isClient'

const COLLAPSE_HEADER_AFTER = 25

const headerIsCollapsedAt = (scrollPosition: number): boolean =>
  scrollPosition > COLLAPSE_HEADER_AFTER

export const getScrollPosition = (): number =>
  isClient ? window.pageYOffset : 0

export const getScrollNode = (): Element =>
  document.scrollingElement || document.documentElement

export const getHeaderHeightAt = (scrollPosition?: number): number => {
  let header = getCustomProperty('--layout-header-height')

  if (
    document.getElementById('header')?.dataset.collapsed ||
    (scrollPosition !== undefined && headerIsCollapsedAt(scrollPosition))
  ) {
    header = getCustomProperty('--layout-header-height-collapsed')
  }

  return header as number
}

export const getHeaderHeight = (): number => getHeaderHeightAt()

export const useHeaderIsScrolled = (): boolean => {
  const { y } = useWindowScroll()

  return headerIsCollapsedAt(y)
}

export const scrollIntoLayout = (
  node: Element | null,
  opts?: {
    smooth: true
    offset?: number
    duration?: number
    ease?: (value: number) => number
  }
): void => {
  if (!node) {
    return
  }

  const htmlNode = getScrollNode()
  const nodeOffset = node.getBoundingClientRect()
  const position = htmlNode.scrollTop + nodeOffset.top + (opts?.offset || 0)
  const headerHeight = getHeaderHeightAt(position)
  const scrollTo = Math.floor(position - headerHeight)

  if (!opts?.smooth) {
    requestAnimationFrame(() => (htmlNode.scrollTop = scrollTo))
    return
  }

  scroll.top(htmlNode, scrollTo, {
    duration: opts?.duration,
    ease: opts?.ease
  })
}
