import React from 'react'
import { graphql } from 'gatsby'
import { Node } from 'unist'
import { getItemByPath } from '../utils/shared/sidebar'

import SEO from '../components/SEO'

import Documentation from '../components/Documentation'

interface IDocPageProps {
  data: {
    page: {
      htmlAst: Node
    }
  }
  pageContext: {
    slug: string
    headings: []
  }
}

const DocPage: React.FC<IDocPageProps> = ({
  data,
  pageContext: { slug, headings }
}) => {
  const {
    page: { htmlAst }
  } = data

  const { label } = getItemByPath(slug)

  return (
    <>
      <SEO title={label} />
      <Documentation htmlAst={htmlAst} path={slug} headings={headings} />
    </>
  )
}

export default DocPage

export const pageQuery = graphql`
  query DocPage($id: String!) {
    page: docsPage(id: { eq: $id }) {
      htmlAst
    }
  }
`
