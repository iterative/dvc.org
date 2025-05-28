import { HeadProps, PageProps, Script, graphql } from 'gatsby'
import { IGatsbyImageData } from 'gatsby-plugin-image'
import type { Element } from 'hast'
import { useEffect } from 'react'

import BackSection from '@/components/BackSection'
import BlogLayout from '@/components/Blog/Layout'
import Post from '@/components/Blog/Post'
import SEO from '@/components/SEO'

import { blogsPageLink } from '@/constants/internalLinks'
import { isProduction } from '@/utils'
import { ISocialIcon } from '@dvcorg/gatsby-theme/src/components/SocialIcon'

export interface IBlogPostHeroPic {
  picture?: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData
    }
  }
  pictureComment?: string
}

export interface IAuthor {
  name: string
  links: Array<ISocialIcon>
  avatar: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData
    }
  }
}

export interface IBlogPostData {
  id: string
  slug: string
  title: string
  date: string
  description: string
  descriptionLong?: {
    html: string
  }
  commentsUrl?: string
  tags?: string[]
  picture?: {
    relativePath: string
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData
    }
  }
  pictureComment?: {
    html: string
  }
  author: IAuthor
  contributors?: IAuthor[]
  parent: {
    timeToRead: string
    htmlAst: Element
  }
}

interface IBlogPostPageProps {
  data: {
    blogPost: IBlogPostData
  }
  location: PageProps['location']
}

const BlogPostPage: React.FC<IBlogPostPageProps> = ({ data, location }) => {
  const post = data.blogPost

  useEffect(() => {
    const link = document.createElement(`link`)
    link.rel = `preload`
    link.href = `https://github.githubassets.com/assets/gist-embed-b67d146bba31.css`
    link.as = `style`

    const onLoad = () => {
      link.rel = `stylesheet`
    }

    link.addEventListener(`load`, onLoad)
    document.head.appendChild(link)

    return () => {
      link.removeEventListener(`load`, onLoad)
      if (document.head.contains(link)) document.head.removeChild(link)
    }
  }, [])

  return (
    <BlogLayout location={location}>
      <Script src="//embed.redditmedia.com/widgets/platform.js" />
      <BackSection link={blogsPageLink} section="top">
        Back to blogs
      </BackSection>
      <article>
        <Post {...post} />
      </article>
      <BackSection link={blogsPageLink} section="bottom">
        Back to blogs
      </BackSection>
    </BlogLayout>
  )
}

export default BlogPostPage

export const Head = ({
  location,
  data: {
    blogPost: { title, description, picture, author, contributors, date }
  }
}: IBlogPostPageProps & HeadProps) => {
  return (
    <>
      <SEO
        pathname={location.pathname}
        title={title}
        description={description}
        image={
          picture &&
          (isProduction
            ? `/blog/images/${picture.relativePath}`
            : picture.childImageSharp.gatsbyImageData)
        }
        imageHeight={picture?.childImageSharp.gatsbyImageData.height}
        imageWidth={picture?.childImageSharp.gatsbyImageData.width}
        meta={[
          {
            name: `twitter:card`,
            content: `summary_large_image`
          },
          {
            property: `og:type`,
            content: `article`
          },
          {
            property: `article:author`,
            content: author.name
          },
          {
            property: `article:published_time`,
            content: new Date(date).toISOString().slice(0, 10)
          }
        ]}
      />
      {isProduction && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': `https://schema.org`,
            '@type': `BlogPosting`,
            headline: title,
            datePublished: date,
            description,
            author: [
              {
                '@type': `Person`,
                name: author.name,
                url: author.links?.[0]?.url
              },
              ...(contributors
                ? contributors.map(c => ({
                    '@type': `Person`,
                    name: c.name,
                    url: c.links?.[0]?.url
                  }))
                : [])
            ],
            image: {
              '@type': `ImageObject`,
              url:
                picture && `https://dvc.ai/blog/images/${picture.relativePath}`
            }
          })}
        </script>
      )}
    </>
  )
}

export const pageQuery = graphql`
  query BlogPostPage($id: String!) {
    blogPost(id: { eq: $id }) {
      parent {
        ... on MarkdownRemark {
          htmlAst
          timeToRead
        }
      }
      id
      slug
      title
      date(formatString: "MMMM DD, YYYY")
      description
      descriptionLong {
        html
      }
      tags
      commentsUrl
      author {
        name
        links {
          url
          site
        }
        avatar {
          childImageSharp {
            gatsbyImageData(
              width: 40
              height: 40
              transformOptions: { cropFocus: CENTER }
              layout: FIXED
            )
          }
        }
      }
      contributors {
        name
        links {
          url
          site
        }
        avatar {
          childImageSharp {
            gatsbyImageData(
              width: 18
              height: 18
              transformOptions: { cropFocus: CENTER }
              layout: FIXED
            )
          }
        }
      }
      picture {
        relativePath
        childImageSharp {
          gatsbyImageData(width: 850, quality: 90)
        }
      }
      pictureComment {
        html
      }
    }
  }
`
