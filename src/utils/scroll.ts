import scroll from 'scroll'
import { useWindowScroll } from 'react-use'
export { default as ease } from 'ease-component'

import { getCustomProperty } from './customProperties'

const COLLAPSE_HEADER_AFTER = 25

const headerIsCollapsedAt = (scrollPosition: number) =>
  scrollPosition > COLLAPSE_HEADER_AFTER

export const getHeaderHeightAt = (scrollPosition?: number) => {
  let header = getCustomProperty('--layout-header-height')

  if (
    document.getElementById('header')?.dataset.collapsed ||
    (scrollPosition !== undefined && headerIsCollapsedAt(scrollPosition))
  ) {
    header = getCustomProperty('--layout-header-height-collapsed')
  }

  return header as number
}

export const getHeaderHeight = () => getHeaderHeightAt()

export const useHeaderIsScrolled = () => {
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
) => {
  if (!node) {
    return
  }

  const htmlNode = document.documentElement
  const nodeOffset = node.getBoundingClientRect()
  const position = htmlNode.scrollTop + nodeOffset.top + (opts?.offset || 0)
  const headerHeight = getHeaderHeightAt(position)
  const scrollTo = position - headerHeight

  if (!opts?.smooth) {
    htmlNode.scrollTop = scrollTo
    return
  }

  scroll.top(htmlNode, scrollTo, {
    duration: opts?.duration,
    ease: opts?.ease
  })
}
