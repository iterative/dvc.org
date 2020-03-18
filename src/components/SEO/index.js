import PropTypes from 'prop-types'
import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import Helmet from 'react-helmet'

function SEO({
  title,
  defaultMetaTitle,
  description,
  keywords,
  image,
  lang,
  meta
}) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            keywords
            siteUrl
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description

  const metaKeywords = keywords || site.siteMetadata.keywords

  const metaTitle = title && !defaultMetaTitle ? title : site.siteMetadata.title

  const metaImage = image || '/social-share.png'

  const defaultMeta = [
    {
      property: 'description',
      content: metaDescription
    },
    {
      property: 'keywords',
      content: metaKeywords
    },
    {
      property: 'og:title',
      content: metaTitle
    },
    {
      property: 'og:description',
      content: metaDescription
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:image',
      content: metaImage
    },
    {
      property: 'og:image:secure_url',
      content: metaImage
    },
    {
      name: 'twitter:card',
      content: `summary_large_image`
    },
    {
      name: 'twitter:title',
      content: metaTitle
    },
    {
      name: 'twitter:description',
      content: metaDescription
    },
    {
      name: 'twitter:image',
      content: encodeURI(`${site.siteMetadata.siteUrl}${metaImage}`)
    }
  ]

  return (
    <Helmet
      htmlAttributes={{
        lang
      }}
      title={title}
      defaultTitle={site.siteMetadata.title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[...defaultMeta, ...meta]}
      link={[
        {
          rel: 'shortcut icon',
          type: 'image/x-icon',
          href: '/favicon.ico'
        },
        {
          rel: 'shortcut icon',
          type: 'image/vnd.microsoft.icon',
          href: '/favicon.ico'
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon-32x32.png',
          sizes: '32x32'
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon-16x16.png',
          sizes: '16x16'
        }
      ]}
    />
  )
}

SEO.propTypes = {
  title: PropTypes.string,
  defaultMetaTitle: PropTypes.bool,
  description: PropTypes.string,
  keywords: PropTypes.array,
  image: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.array
}

SEO.defaultProps = {
  lang: `en`,
  meta: []
}

export default SEO
