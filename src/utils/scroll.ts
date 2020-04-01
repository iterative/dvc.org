import scroll from 'scroll'
export { default as ease } from 'ease-component'

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
  const headerHeight = document.getElementById('header')?.clientHeight || 0
  const nodeOffset = node.getBoundingClientRect()
  const position =
    htmlNode.scrollTop + nodeOffset.top - headerHeight + (opts?.offset || 0)

  if (!opts?.smooth) {
    htmlNode.scrollTop = position
    return
  }

  scroll.top(htmlNode, position, {
    duration: opts?.duration,
    ease: opts?.ease
  })
}
