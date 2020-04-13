import React from 'react'
import { graphql } from 'gatsby'
import { Node } from 'unist'
import { getItemByPath } from '../utils/shared/sidebar'

import SEO from '../components/SEO'

import Documentation from '../components/Documentation'

interface IDocHomePageProps {
  data: {
    page: {
      parent: {
        htmlAst: Node
      }
    }
  }
  pageContext: {
    slug: string
    headings: []
  }
}

const DocHomePage: React.FC<IDocHomePageProps> = ({
  data,
  pageContext: { slug, headings }
}) => {
  const {
    page: {
      parent: { htmlAst }
    }
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
  query DocPage($id: String!) {
    page: docsPage(id: { eq: $id }) {
      parent {
        ... on MarkdownRemark {
          htmlAst
        }
      }
    }
  }
`
