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

export const getHeaderHeightAt = (): number => {
  const header = getCustomProperty('--layout-header-height')

  return header as number
}

export const getHeaderHeight = (): number => getHeaderHeightAt()

export const useHeaderIsScrolled = (): boolean => {
  const { y } = useWindowScroll()

  return headerIsCollapsedAt(y)
}
export const getOverflowTop = (
  container: Element | null,
  element: Element | null
): number | undefined => {
  if (!container || !element) {
    return
  }

  const containerNodeOffset = container.getBoundingClientRect()
  const elementNodeOffset = element.getBoundingClientRect()

  return containerNodeOffset.top - elementNodeOffset.top
}
export const getOverflowBottom = (
  container: Element | null,
  element: Element | null
): number | undefined => {
  if (!container || !element) {
    return
  }

  const containerNodeOffset = container.getBoundingClientRect()
  const elementNodeOffset = element.getBoundingClientRect()

  return elementNodeOffset.bottom - containerNodeOffset.bottom
}

type ScrollOptions = {
  offset?: number
  waitImages?: boolean
} & {
  smooth?: true
  duration?: number
  ease?: (value: number) => number
}

const scrollToPosition = (
  node: Element,
  opts?: ScrollOptions,
  parent?: Element | null
): void => {
  const parentNode = parent || getScrollNode()
  const nodeOffset = node.getBoundingClientRect()
  const parentNodeOffset = parentNode.getBoundingClientRect()
  const top = nodeOffset.top - Math.max(parentNodeOffset.top, 0)
  const nodePosition = parentNode.scrollTop + top + (opts?.offset || 0)
  // const headerHeight = getHeaderHeightAt(nodePosition)
  const headerHeight = getHeaderHeightAt()
  const scrollTo = Math.floor(nodePosition - headerHeight)

  if (!opts?.smooth) {
    requestAnimationFrame(() => (parentNode.scrollTop = scrollTo))
    return
  }

  scroll.top(parentNode, scrollTo, {
    duration: opts?.duration,
    ease: opts?.ease
  })
}

export const scrollIntoLayout = (
  node: Element | null,
  opts?: ScrollOptions,
  parent?: Element | null
): void => {
  if (!node) {
    return
  }

  if (!opts?.waitImages) {
    return scrollToPosition(node, opts, parent)
  }

  const contentRoot = document.getElementById(CONTENT_ROOT_ID)
  if (contentRoot) {
    allImagesLoadedInContainer(contentRoot).then(() =>
      scrollToPosition(node, opts, parent)
    )
  }
}
