import React from 'react'
import { Node } from 'unist'

import Markdown from './Markdown'
import RightPanel from './RightPanel'

import { getItemByPath } from '../../utils/shared/sidebar'
import { getGithubLink } from '../../getGithubLink'

export interface IHeading {
  slug: string
  text: string
}

interface IDocumentationProps {
  path: string
  headings: Array<IHeading>
  htmlAst: Node
}

const Documentation: React.FC<IDocumentationProps> = ({
  htmlAst,
  path,
  headings
}) => {
  const { source, prev, next, tutorials } = getItemByPath(path)
  const githubLink = getGithubLink(source)

  return (
    <>
      <Markdown
        htmlAst={htmlAst}
        prev={prev}
        next={next}
        githubLink={githubLink}
        tutorials={tutorials}
      />
      <RightPanel
        headings={headings}
        githubLink={githubLink}
        tutorials={tutorials}
      />
    </>
  )
}

export default Documentation
