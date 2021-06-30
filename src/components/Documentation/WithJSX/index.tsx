import React from 'react'

import MarkdownMain from '../Markdown/Main'
import RightPanel from '../RightPanel'

import { IHeading, getGithubLink } from '../'
import { getItemByPath } from '../../../utils/shared/sidebar'

interface IDocumentationProps {
  path: string
  headings: Array<IHeading>
}

const Documentation: React.FC<IDocumentationProps> = ({
  children,
  path,
  headings
}) => {
  const { source, prev, next, tutorials } = getItemByPath(path)
  const githubLink = getGithubLink(source)

  return (
    <>
      <MarkdownMain
        prev={prev}
        next={next}
        githubLink={githubLink}
        tutorials={tutorials}
      >
        {children}
      </MarkdownMain>
      <RightPanel
        headings={headings}
        githubLink={githubLink}
        tutorials={tutorials}
      />
    </>
  )
}

export default Documentation
