import React from 'react'
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'

import SEO from '../components/SEO'

import Documentation from '../components/Documentation'

export default function DocumentationTemplate({
  data,
  pageContext: { slug, headings }
}) {
  const {
    page: { htmlAst }
  } = data

  return (
    <>
      <SEO />
      <Documentation htmlAst={htmlAst} path={slug} headings={headings} />
    </>
  )
}

DocumentationTemplate.propTypes = {
  data: PropTypes.object,
  pageContext: PropTypes.object
}

export const pageQuery = graphql`
  query DocPageBySlug($slug: String!) {
    page: markdownRemark(fields: { slug: { eq: $slug } }) {
      htmlAst
    }
  }
`
