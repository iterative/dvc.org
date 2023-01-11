import type { GatsbyNode } from 'gatsby'

const isTypedLine = (line: string) => line.startsWith('$')

const wrapWithBackticks = (line: string) => `\`${line}\``

const DEFAULT_TYPED_LINE_PAUSE = '^250'

const wrapAndAddPause = (line: string, addedPause: string | undefined) => {
  if (isTypedLine(line)) {
    return line + (addedPause || DEFAULT_TYPED_LINE_PAUSE)
  } else {
    const wrappedLine = wrapWithBackticks(line)
    if (addedPause) {
      return wrappedLine + addedPause
    }
    return wrappedLine
  }
}

const _wrapOutputLine = (line: string): string => {
  const regexResult = /\^[0-9]+$/.exec(line)
  console.log(line, regexResult)
  if (regexResult) {
    const addedPause = regexResult[0]
    const originalLine = line.slice(0, regexResult.index)
    return wrapAndAddPause(originalLine, addedPause)
  }
  return wrapAndAddPause(line, undefined)
}

const wrapOutputLine = (line: string): string => {
  const result = _wrapOutputLine(line)
  console.log({ line, result })
  return result
}

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
