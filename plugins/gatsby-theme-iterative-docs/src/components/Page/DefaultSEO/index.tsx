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
      property: 'og:site_name',
      content: metaTitle
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
      property: 'og:image:type',
      content: 'image/png'
    },
    {
      property: 'og:locale',
      content: 'en_US'
    },
    {
      name: 'twitter:site',
      content: '@DVCorg'
    },
    {
      name: 'twitter:creator',
      content: '@DVCorg'
    },
    {
      name: 'twitter:card',
      content: 'summary'
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
    },
    {
      name: 'twitter:image:alt',
      content: 'The DVC logo on a gray background'
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
        { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#13adc7' },
        {
          rel: 'canonical',
          href: fullUrl
        }
      ]}
    >
      <script
        defer
        data-domain="dvc.org"
        src="https://plausible.io/js/plausible.outbound-links.js"
      ></script>
    </Helmet>
  )
}

export default DefaultSEO
