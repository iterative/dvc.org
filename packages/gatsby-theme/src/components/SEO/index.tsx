import { IGatsbyImageData } from 'gatsby-plugin-image'
import { useMemo } from 'react'
import { Helmet } from 'react-helmet'

import useSiteMeta from '../../queries/useSiteMeta'

import { buildMetadata, MetaProps, LinkProps } from './helper'

export interface IPaginatorPageInfo {
  currentPage: number
  nextPage?: string
  previousPage?: string
}

interface ISEOProps {
  title?: string
  defaultMetaTitle?: boolean
  skipTitleTemplate?: boolean
  description?: string
  keywords?: string
  imageAlt?: string
  image?: IGatsbyImageData | string
  imageHeight?: number
  imageWidth?: number
  meta?: MetaProps[]
  link?: LinkProps[]
  canonicalUrl?: string
  pathname?: string
  pageInfo?: IPaginatorPageInfo
  children?: React.ReactNode
}

const GATSBY_USERCENTRICS_SETTINGS_ID =
  process.env.GATSBY_USERCENTRICS_SETTINGS_ID

const SEO: React.FC<ISEOProps> = ({
  title,
  defaultMetaTitle,
  skipTitleTemplate,
  description,
  keywords,
  image = '/social-share.png',
  imageAlt = '',
  imageHeight = 630,
  imageWidth = 1200,
  meta = [],
  link = [],
  canonicalUrl,
  pathname,
  pageInfo,
  children
}) => {
  const siteMeta = useSiteMeta()
  const fullUrl = siteMeta.siteUrl + pathname
  const pageTitle = useMemo(() => {
    return pageInfo && pageInfo.currentPage > 1
      ? `${title || siteMeta.title} page ${pageInfo.currentPage}`
      : title
  }, [title, siteMeta, pageInfo])
  const prebuildMeta = useMemo(() => {
    return buildMetadata({
      siteUrl: siteMeta.siteUrl,
      siteName: siteMeta.title,
      title: pageTitle || siteMeta.title,
      defaultMetaTitle,
      description: description || siteMeta.description,
      keywords: keywords || siteMeta.keywords,
      image,
      imageAlt: imageAlt || siteMeta.imageAlt,
      imageHeight,
      imageWidth,
      pathname,
      twitterUsername: siteMeta.twitterUsername
    })
  }, [
    siteMeta,
    pageTitle,
    defaultMetaTitle,
    description,
    keywords,
    image,
    imageAlt,
    imageWidth,
    imageHeight,
    pathname
  ])

  return (
    /* @ts-expect-error react-helmet types incompatible with React types */
    <Helmet
      htmlAttributes={{
        lang: 'en'
      }}
      defaultTitle={siteMeta.title}
      title={pageTitle}
      titleTemplate={
        skipTitleTemplate
          ? ''
          : siteMeta.titleTemplate || `%s | ${siteMeta.title}`
      }
      meta={[...prebuildMeta, ...meta]}
      link={[
        ...(canonicalUrl
          ? [
              {
                rel: 'canonical',
                href: canonicalUrl
              }
            ]
          : pathname
            ? [
                {
                  rel: 'canonical',
                  href: fullUrl
                }
              ]
            : []),
        ...link
      ]}
    >
      {siteMeta.plausibleSrc ? (
        <script
          defer
          data-domain={
            siteMeta.plausibleDomain || new URL(siteMeta.siteUrl).hostname
          }
          data-api={siteMeta.plausibleAPI || undefined}
          src={siteMeta.plausibleSrc}
        />
      ) : null}

      {GATSBY_USERCENTRICS_SETTINGS_ID && (
        <script src="https://web.cmp.usercentrics.eu/modules/autoblocker.js" />
      )}
      {GATSBY_USERCENTRICS_SETTINGS_ID && (
        <script
          id="usercentrics-cmp"
          src="https://web.cmp.usercentrics.eu/ui/loader.js"
          data-settings-id={GATSBY_USERCENTRICS_SETTINGS_ID}
          async
        />
      )}
      {children}
    </Helmet>
  )
}

export * from './helper'

export default SEO
