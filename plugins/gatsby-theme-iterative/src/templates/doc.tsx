import React from 'react'
import { graphql, PageProps } from 'gatsby'
import { Element } from 'hast'
import { getItemByPath } from '../utils/shared/sidebar'

import SEO from '../components/SEO'

import Documentation from '../components/Documentation'
import DocumentationLayout from '../components/Documentation/Layout'
import MainLayout, { LayoutModifiers } from '../components/MainLayout'

const DocPage: React.FC<
  PageProps<
    {
      page: {
        description?: string
        title?: string
        parent: {
          htmlAst: Element
        }
      }
    },
    {
      slug: string
      headings: []
      is404: boolean
      isAlertLanding: boolean
      pageInfo?: {
        currentPage: number
        nextPage?: string
      }
    }
  >
> = ({ data, pageContext, location }) => {
  const { headings } = pageContext
  const { pathname } = location
  const {
    page: {
      description,
      title,
      parent: { htmlAst }
    }
  } = data

  const { label } = getItemByPath(pathname)

  return (
    <MainLayout
      location={location}
      modifiers={[LayoutModifiers.Wide, LayoutModifiers.Collapsed]}
    >
      <DocumentationLayout currentPath={pathname}>
        <SEO title={title || label} description={description} />
        <Documentation htmlAst={htmlAst} path={pathname} headings={headings} />
      </DocumentationLayout>
    </MainLayout>
  )
}

export default DocPage

export const pageQuery = graphql`
  query DocPage($id: String!) {
    page: docsPage(id: { eq: $id }) {
      description
      title
      parent {
        ... on MarkdownRemark {
          htmlAst
        }
      }
    }
  }
`
