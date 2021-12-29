import React from 'react'
import { getItemByPath } from '../../plugins/gatsby-theme-iterative-docs/sidebar-helpers'
import sidebar from '../../plugins/gatsby-theme-iterative-docs/src/sidebar'

import SEO from '../components/SEO'

import Documentation from '../components/Documentation/WithJSX'

interface IJSXDocPageProps {
  title?: string
  description?: string
  slug: string
  headings: []
}

const JSXDocPage: React.FC<IJSXDocPageProps> = ({
  title,
  description,
  children,
  slug,
  headings
}) => {
  const { label } = getItemByPath(sidebar, slug)
  return (
    <>
      <SEO title={title || label} description={description} />
      <Documentation headings={headings} path={slug}>
        {children}
      </Documentation>
    </>
  )
}

export default JSXDocPage
