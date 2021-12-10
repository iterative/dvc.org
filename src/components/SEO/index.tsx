import React, { useMemo } from 'react'
import Helmet from 'react-helmet'
import { IGatsbyImageData } from 'gatsby-plugin-image'

import getSiteMeta from '../../queries/siteMeta'
import { IPaginatorPageInfo } from '../Paginator'
import { buildMetadata, MetaProps } from './helper'

interface ISEOProps {
  title?: string
  defaultMetaTitle?: boolean
  description?: string
  keywords?: string
  imageAlt?: string
  image?: IGatsbyImageData
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
      imageAlt
    )
  }, [
    siteMeta,
    pageTitle,
    defaultMetaTitle,
    description,
    keywords,
    image,
    imageAlt
  ])

  return (
    <Helmet title={pageTitle} meta={[...prebuildMeta, ...meta]}>
      {children}
    </Helmet>
  )
}

export * from './helper'

export default SEO
