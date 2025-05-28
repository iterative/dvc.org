import React, { PropsWithChildren } from 'react'

import MarkdownMain from '../Markdown/Main'
import RightPanel from '../RightPanel'

import { IHeading } from '../'
import { getItemByPath } from '../../../utils/shared/sidebar'
import getEditLink from '../../../getEditLink'

interface IWithJSXProps {
  path: string
  headings: Array<IHeading>
}

const WithJSX: React.FC<PropsWithChildren<IWithJSXProps>> = ({
  children,
  path,
  headings
}) => {
  const { source, prev, next, tutorials } = getItemByPath(path)
  const githubLink = getEditLink(source)

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
