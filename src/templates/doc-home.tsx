import React from 'react'
import { graphql } from 'gatsby'
import { Node } from 'unist'
import { getItemByPath } from '../utils/shared/sidebar'

import SEO from '../components/SEO'

import Documentation from '../components/Documentation'

interface IDocHomePageProps {
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

const DocHomePage: React.SFC<IDocHomePageProps> = ({
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

export default DocHomePage

export const pageQuery = graphql`
  query DocPageBySlug($slug: String!) {
    page: markdownRemark(fields: { slug: { eq: $slug } }) {
      htmlAst
    }
  }
`
