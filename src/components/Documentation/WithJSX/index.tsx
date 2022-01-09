import React from 'react'

import MarkdownMain from '../Markdown/Main'
import RightPanel from '../RightPanel'

import { IHeading, getGithubLink } from '../'
import { getItemByPath } from '../../../utils/shared/sidebar'

interface IWithJSXProps {
  path: string
  headings: Array<IHeading>
}

const WithJSX: React.FC<IWithJSXProps> = ({ children, path, headings }) => {
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

export default WithJSX
