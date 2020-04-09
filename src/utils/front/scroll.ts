import scroll from 'scroll'
import { useWindowScroll } from 'react-use'
export { default as ease } from 'ease-component'

import { getCustomProperty } from './customProperties'
import isClient from './isClient'
import { allImagesLoadedInContainer } from './images'

const CONTENT_ROOT_ID = 'layoutContent'
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

type ScrollOptions = {
  offset?: number
  waitImages?: boolean
} & {
  smooth?: true
  duration?: number
  ease?: (value: number) => number
}

const scrollToPosition = (node: Element, opts?: ScrollOptions): void => {
  const htmlNode = getScrollNode()
  const nodeOffset = node.getBoundingClientRect()
  const nodePosition = htmlNode.scrollTop + nodeOffset.top + (opts?.offset || 0)
  const headerHeight = getHeaderHeightAt(nodePosition)
  const scrollTo = Math.floor(nodePosition - headerHeight)

  if (!opts?.smooth) {
    requestAnimationFrame(() => (htmlNode.scrollTop = scrollTo))
    return
  }

  scroll.top(htmlNode, scrollTo, {
    duration: opts?.duration,
    ease: opts?.ease
  })
}

export const scrollIntoLayout = (
  node: Element | null,
  opts?: ScrollOptions
): void => {
  if (!node) {
    return
  }

  if (!opts?.waitImages) {
    return scrollToPosition(node, opts)
  }

  const contentRoot = document.getElementById(CONTENT_ROOT_ID)
  if (contentRoot) {
    allImagesLoadedInContainer(contentRoot).then(() =>
      scrollToPosition(node, opts)
    )
  }
}
