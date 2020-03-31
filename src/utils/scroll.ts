export const scrollIntoLayout = (node: Element | null) => {
  if (!node) {
    return
  }

  const htmlNode = document.documentElement
  const headerHeight = document.getElementById('header')?.clientHeight || 0
  const nodeOffset = node.getBoundingClientRect()

  htmlNode.scrollTop = htmlNode.scrollTop + nodeOffset.top - headerHeight
}
