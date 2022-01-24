import { getSrc, IGatsbyImageData } from 'gatsby-plugin-image'

export type MetaProps = JSX.IntrinsicElements['meta']

export const getMetaTitle = (title: string): MetaProps[] => {
  return [
    {
      property: 'og:title',
      content: title
    },
    {
      name: 'twitter:title',
      content: title
    }
  ]
}

export const getMetaDescription = (description: string): MetaProps[] => {
  return [
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
  ]
}

export const getMetaImage = (
  imageUrl: string,
  imageAlt?: string,
  imageHeight?: number,
  imageWidth?: number
): MetaProps[] => {
  return [
    { property: 'og:image', content: imageUrl },
    { name: 'og:image:alt', content: imageAlt },
    { property: 'og:image:width', content: String(imageWidth) },
    { property: 'og:image:height', content: String(imageHeight) },
    { name: 'twitter:image', content: imageUrl },
    { name: 'twitter:image:alt', content: imageAlt }
  ]
}

export const buildMetadata = (
  siteUrl: string,
  title?: string,
  defaultMetaTitle?: boolean,
  description?: string,
  keywords?: string,
  image?: IGatsbyImageData | string,
  imageAlt?: string,
  imageHeight?: number,
  imageWidth?: number
) => {
  const prebuildMeta: MetaProps[] = []
  if (title && !defaultMetaTitle) {
    prebuildMeta.push(...getMetaTitle(title))
  }
  if (description) {
    prebuildMeta.push(...getMetaDescription(description))
  }
  if (keywords) {
    prebuildMeta.push({
      name: 'keywords',
      content: keywords
    })
  }
  if (image) {
    const isStr = typeof image === 'string'
    const imageUrl = siteUrl + (isStr ? image : getSrc(image))
    prebuildMeta.push(
      ...getMetaImage(imageUrl, imageAlt, imageHeight, imageWidth)
    )
  }
  return prebuildMeta
}
