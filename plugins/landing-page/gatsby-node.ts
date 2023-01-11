import type { GatsbyNode } from 'gatsby'

const wrapOutputLine = (line: string): string =>
  line.startsWith('$') ? line + '^250' : `\`${line}\``

export const onCreateNode: GatsbyNode['onCreateNode'] = async api => {
  const {
    node,
    loadNodeContent,
    createNodeId,
    actions: { createNode, createParentChildLink }
  } = api
  if (node.internal.type === 'File' && node.sourceInstanceName === 'data') {
    const fileContent = await loadNodeContent(node)
    const homeSlides = JSON.parse(fileContent)
    const processedSlides = homeSlides.map(item => {
      const { terminal } = item
      return {
        ...item,
        terminal: terminal.split('\n').map(wrapOutputLine).join('\n')
      }
    })
    const landingPageNode = {
      slides: processedSlides,

      id: createNodeId('LandingPage'),
      parent: node.id,
      children: [],
      internal: {
        type: 'LandingPage',
        contentDigest: node.internal.contentDigest
      }
    }
    createNode(landingPageNode)
    createParentChildLink({ child: landingPageNode, parent: node })
  }
}
