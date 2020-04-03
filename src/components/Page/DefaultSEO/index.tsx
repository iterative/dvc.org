import React from 'react'
import ReactHelmet from 'react-helmet'

import { MetaProps } from '../../SEO'
import { IPaginatorPageInfo } from '../../Paginator'
import getSiteMeta from '../../../queries/siteMeta'

interface IDefaultSEOProps {
  pageInfo?: IPaginatorPageInfo
}

const DefaultSEO: React.SFC<IDefaultSEOProps> = ({ pageInfo }) => {
  const siteMeta = getSiteMeta()
  const metaTitle =
    pageInfo && pageInfo.currentPage > 1
      ? `${siteMeta.title} page ${pageInfo.currentPage}`
      : siteMeta.title
  const metaDescription = siteMeta.description
  const metaKeywords = siteMeta.keywords
  const metaImage = '/social-share.png'

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
      content: encodeURI(`${siteMeta.siteUrl}${metaImage}`)
    }
  ]

  return (
    <ReactHelmet
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
        }
      ]}
    />
  )
}

export default DefaultSEO
