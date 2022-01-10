import { getSrc, getImage, IGatsbyImageData } from 'gatsby-plugin-image'

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
  imageData?: IGatsbyImageData
): MetaProps[] => {
  return [
    { property: 'og:image', content: imageUrl },
    { name: 'og:image:alt', content: imageAlt },
    { property: 'og:image:width', content: String(imageData?.width) },
    { property: 'og:image:height', content: String(imageData?.height) },
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
  image?: IGatsbyImageData,
  imageAlt?: string
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
    const imageUrl = siteUrl + getSrc(image)
    const imageData = getImage(image)
    prebuildMeta.push(...getMetaImage(imageUrl, imageAlt, imageData))
  }
  return prebuildMeta
}
