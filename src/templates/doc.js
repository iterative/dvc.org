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
    markdownRemark: { html }
  } = data

  return (
    <>
      <SEO />
      <Documentation html={html} path={slug} headings={headings} />
    </>
  )
}

DocumentationTemplate.propTypes = {
  data: PropTypes.object,
  pageContext: PropTypes.object
}

export const pageQuery = graphql`
  query DocPageBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
    }
  }
`
