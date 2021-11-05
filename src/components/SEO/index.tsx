import React from 'react'
import Helmet from 'react-helmet'

import { IPaginatorPageInfo } from '../Paginator'
import getSiteMeta from '../../queries/siteMeta'
import { getSrc, getImage, IGatsbyImageData } from 'gatsby-plugin-image'

export type MetaProps = JSX.IntrinsicElements['meta']

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
  const prebuildMeta: MetaProps[] = []

  if (pageInfo && pageInfo.currentPage > 1) {
    title = `${title || siteMeta.title} page ${pageInfo.currentPage}`
  }

  if (title && !defaultMetaTitle) {
    prebuildMeta.push(
      {
        property: 'og:title',
        content: title
      },
      {
        name: 'twitter:title',
        content: title
      }
    )
  }

  if (description) {
    prebuildMeta.push(
      {
        name: 'description',
        content: description
      },
      {
        property: 'og:description',
        content: description
      },
      {
        name: 'twitter:description',
        content: description
      }
    )
  }

  if (keywords) {
    prebuildMeta.push({
      name: 'keywords',
      content: keywords
    })
  }

  if (image) {
    const imageUrl = siteMeta.siteUrl + getSrc(image)
    const imageData = getImage(image)

    prebuildMeta.push(
      {
        property: 'og:image',
        content: imageUrl
      },
      {
        name: 'og:image:alt',
        content: imageAlt
      },
      {
        property: 'og:image:width',
        content: String(imageData?.width)
      },
      {
        property: 'og:image:height',
        content: String(imageData?.height)
      },
      {
        name: 'twitter:image',
        content: imageUrl
      },
      {
        name: 'twitter:image:alt',
        content: imageAlt
      }
    )
  }

  return (
    <Helmet title={title} meta={[...prebuildMeta, ...meta]}>
      {children}
    </Helmet>
  )
}

export default SEO
