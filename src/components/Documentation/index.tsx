import React from 'react'

import Markdown from './Markdown'
import RightPanel from './RightPanel'

import { getItemByPath } from '../../utils/shared/sidebar'

export interface IHeading {
  slug: string
  text: string
}

interface IDocumentationProps {
  path: string
  headings: Array<IHeading>
  htmlAst: object
}

const Documentation: React.FC<IDocumentationProps> = ({
  htmlAst,
  path,
  headings
}) => {
  const { source, prev, next, tutorials } = getItemByPath(path)
  const githubLink = `https://github.com/iterative/dvc.org/blob/master/content${source}`

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
