import { graphql, useStaticQuery } from 'gatsby'
import { IGatsbyImageData, getSrc } from 'gatsby-plugin-image'
import { useMemo } from 'react'

import { IPaginatorPageInfo } from '@/components/Blog/Paginator'

const MetaTitle = ({ title }: { title: string }) => {
  return (
    <>
      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />
    </>
  )
}

const MetaDescription = ({ description }: { description: string }) => {
  return (
    <>
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta name="twitter:description" content={description} />
    </>
  )
}

const MetaImage = ({
  siteUrl,
  image,
  imageAlt,
  imageHeight,
  imageWidth
}: {
  siteUrl: string
  image: IGatsbyImageData | string
  imageAlt?: string
  imageHeight?: number
  imageWidth?: number
}) => {
  if (!image) return null
  const isStr = typeof image === `string`
  const imageUrl = isStr
    ? image.startsWith(`http`)
      ? image
      : siteUrl + image
    : siteUrl + getSrc(image)

  return (
    <>
      <meta property="og:image" content={imageUrl} />
      {imageAlt && <meta name="og:image:alt" content={imageAlt} />}
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={imageAlt} />
    </>
  )
}

const DefaultMeta = () => {
  return (
    <>
      <meta property="og:locale" content="en_US" />
    </>
  )
}

interface BuildMeta {
  name?: string
  content?: string
  property?: string
}

const buildMetadata = (metas: BuildMeta[]) => {
  return metas.map((meta, i) => <meta key={i} {...meta} />)
}

interface LinkProps {
  rel: string
  href: string
}

const buildLink = (links: LinkProps[]) => {
  return links.map((link, i) => <link key={i} {...link} />)
}

const getFullUrl = (siteUrl: string, pathname?: string) => {
  if (pathname && pathname !== `/`) {
    return siteUrl + pathname
  }
  return siteUrl
}

const SEO = ({
  title,
  description,
  canonicalUrl,
  keywords,
  image = `/datachain-social-share.png`,
  imageAlt,
  imageHeight = 630,
  imageWidth = 1200,
  pathname,
  pageInfo,
  meta = [
    {
      name: `twitter:card`,
      content: `summary`
    },
    {
      property: `og:type`,
      content: `website`
    }
  ],
  link = []
}: {
  title?: string
  canonicalUrl?: string
  description?: string
  keywords?: string[]
  imageAlt?: string
  image?: IGatsbyImageData | string
  imageHeight?: number
  imageWidth?: number
  pathname: string
  pageInfo?: IPaginatorPageInfo
  meta?: BuildMeta[]
  link?: LinkProps[]
}) => {
  const siteMeta = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          keywords
          siteUrl
          siteName
          twitterUsername
        }
      }
    }
  `).site.siteMetadata

  const fullUrl = getFullUrl(siteMeta.siteUrl, pathname)

  const siteTitle = useMemo(() => {
    return pageInfo && pageInfo.currentPage > 1
      ? `${title || siteMeta.title} page ${pageInfo.currentPage}`
      : title || siteMeta.title
  }, [pageInfo, title, siteMeta.title])

  const siteDescription = description || siteMeta.description
  const siteKeywords = (keywords || siteMeta.keywords || []).join(`, `)

  return (
    <>
      <html lang="en" />
      <title>{siteTitle}</title>
      <DefaultMeta />
      {buildMetadata(meta)}
      {buildLink([
        ...(canonicalUrl
          ? [{ rel: `canonical`, href: canonicalUrl }]
          : pathname
            ? [{ rel: `canonical`, href: fullUrl }]
            : []),
        ...link
      ])}
      <MetaTitle title={siteTitle} />
      <MetaDescription description={siteDescription} />
      <MetaImage
        siteUrl={siteMeta.siteUrl}
        image={image}
        imageAlt={imageAlt}
        imageHeight={imageHeight}
        imageWidth={imageWidth}
      />
      <meta name="keywords" content={siteKeywords} />
      {pathname && <meta property="og:url" content={fullUrl} />}
      {siteMeta.twitterUsername && (
        <>
          <meta name="twitter:site" content={siteMeta.twitterUsername} />
          <meta name="twitter:creator" content={siteMeta.twitterUsername} />
        </>
      )}
      {siteMeta.siteName && (
        <meta property="og:site_name" content={siteMeta.siteName} />
      )}
    </>
  )
}

export default SEO
