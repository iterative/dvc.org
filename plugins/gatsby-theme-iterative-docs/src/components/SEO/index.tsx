import React, { useMemo } from 'react'
import Helmet from 'react-helmet'
import { IGatsbyImageData } from 'gatsby-plugin-image'

import getSiteMeta from '../../queries/siteMeta'
import { buildMetadata, MetaProps } from './helper'

export interface IPaginatorPageInfo {
  currentPage: number
  nextPage?: string
  previousPage?: string
}

interface ISEOProps {
  title?: string
  defaultMetaTitle?: boolean
  description?: string
  keywords?: string
  imageAlt?: string
  image?: IGatsbyImageData | string
  imageHeight?: number
  imageWidth?: number
  meta?: MetaProps[]
  pageInfo?: IPaginatorPageInfo
  children?: React.ReactNode
}

const SEO: React.FC<ISEOProps> = ({
  title,
  defaultMetaTitle,
  description,
  keywords,
  image,
  imageAlt = '',
  imageHeight,
  imageWidth,
  meta = [],
  pageInfo,
  children
}) => {
  const siteMeta = getSiteMeta()
  const pageTitle = useMemo(() => {
    return pageInfo && pageInfo.currentPage > 1
      ? `${title || siteMeta.title} page ${pageInfo.currentPage}`
      : title
  }, [title, siteMeta, pageInfo])
  const prebuildMeta = useMemo(() => {
    return buildMetadata(
      siteMeta.siteUrl,
      pageTitle,
      defaultMetaTitle,
      description,
      keywords,
      image,
      imageAlt,
      imageHeight,
      imageWidth
    )
  }, [
    siteMeta,
    pageTitle,
    defaultMetaTitle,
    description,
    keywords,
    image,
    imageAlt,
    imageWidth,
    imageHeight
  ])

  return (
    <Helmet title={pageTitle} meta={[...prebuildMeta, ...meta]}>
      {children}
    </Helmet>
  )
}

export * from './helper'

export default SEO
