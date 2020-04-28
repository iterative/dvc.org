import React from 'react'
import Helmet from 'react-helmet'

import { MetaProps } from '../../SEO'
import getSiteMeta from '../../../queries/siteMeta'

interface IDefaultSEOProps {
  pathname: string
}

const metaImage = {
  src: '/social-share.png',
  width: '1200',
  height: '630'
}

const DefaultSEO: React.FC<IDefaultSEOProps> = ({ pathname }) => {
  const siteMeta = getSiteMeta()
  const siteUrl = siteMeta.siteUrl
  const metaTitle = siteMeta.title
  const metaDescription = siteMeta.description
  const metaKeywords = siteMeta.keywords
  const fullUrl = siteUrl + pathname

  const meta: MetaProps[] = [
    {
      name: 'description',
      content: metaDescription
    },
    {
      name: 'keywords',
      content: metaKeywords
    },
    {
      property: 'og:url',
      content: fullUrl
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
      content: siteUrl + metaImage.src
    },
    {
      property: 'og:image:width',
      content: metaImage.width
    },
    {
      property: 'og:image:height',
      content: metaImage.height
    },
    {
      property: 'og:image:secure_url',
      content: siteUrl + metaImage.src
    },
    {
      name: 'twitter:site',
      content: '@dvcORG'
    },
    {
      name: 'twitter:card',
      content: `summary`
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
      content: encodeURI(`${siteUrl}${metaImage.src}`)
    }
  ]

  return (
    <Helmet
      htmlAttributes={{
        lang: 'en'
      }}
      defaultTitle={metaTitle}
      titleTemplate={`%s | ${metaTitle}`}
      meta={meta}
      link={[
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
        },
        {
          rel: 'canonical',
          href: fullUrl
        }
      ]}
    />
  )
}

export default DefaultSEO
