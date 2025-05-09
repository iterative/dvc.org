import type { GatsbyNode } from 'gatsby'
import * as yaml from 'js-yaml'
import Prism from 'prismjs'

import '@dvcorg/gatsby-theme-iterative/config/prismjs/dvc'

const isTypedLine = (line: string) => line.startsWith('$')

const wrapWithBackticks = (line: string) => `\`${line}\``

const DEFAULT_TYPED_LINE_PAUSE = '^250'

const processSplitTerminalLine = (
  line: string,
  addedPause: string | undefined
) => {
  if (isTypedLine(line)) {
    return (
      Prism.highlight(line, Prism.languages.cli, 'cli') +
      (addedPause || DEFAULT_TYPED_LINE_PAUSE)
    )
  } else {
    const wrappedLine = wrapWithBackticks(line)
    if (addedPause) {
      return wrappedLine + addedPause
    }
    return wrappedLine
  }
}

const processTerminalLine = (line: string): string => {
  const regexResult = /\^[0-9]+$/.exec(line)
  if (regexResult) {
    const addedPause = regexResult[0]
    const originalLine = line.slice(0, regexResult.index)
    return processSplitTerminalLine(originalLine, addedPause)
  }
  return processSplitTerminalLine(line, undefined)
}

export const onCreateNode: GatsbyNode['onCreateNode'] = async api => {
  const {
    node,
    loadNodeContent,
    createNodeId,
    actions: { createNode, createParentChildLink }
  } = api
  if (
    node.internal.type === 'File' &&
    node.sourceInstanceName === 'data' &&
    node.relativePath === 'dvc.yml'
  ) {
    const fileContent = await loadNodeContent(node)
    const homeSlides = yaml.load(fileContent)
    const processedSlides = homeSlides.map(item => {
      const { terminal } = item
      return {
        ...item,
        terminal: terminal.split('\n').map(processTerminalLine).join('\n')
      }
    })
    if (node.relativePath === 'dvc.yml') {
      const DvcSlide = {
        id: createNodeId('DvcSlide'),
        parent: node.id,
        children: [],
        internal: {
          type: 'DvcSlide',
          contentDigest: node.internal.contentDigest
        },
        slides: processedSlides
      }
      createNode(DvcSlide)
      createParentChildLink({ child: DvcSlide, parent: node })
    }
  }
}
