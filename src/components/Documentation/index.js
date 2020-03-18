import React from 'react'
import PropTypes from 'prop-types'

import Markdown from './Markdown'
import RightPanel from './RightPanel'

import { getItemByPath } from '../../utils/sidebar'

export default function Documentation({ htmlAst, path, headings }) {
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

Documentation.propTypes = {
  path: PropTypes.string,
  headings: PropTypes.array,
  htmlAst: PropTypes.object
}
